import prisma from "@/lib/db";
import { formatMoney } from "@/lib/utils";
import { getSetting } from "./settings.service";

/**
 * NotificationService — provider-based (EMAIL / SMS / WHATSAPP).
 * Each channel sends for real when its env vars are configured (SendGrid for EMAIL, Twilio for
 * SMS/WHATSAPP), and falls back to logging otherwise — same "sandbox vs real" pattern as
 * payment.service.ts's providers, so this works with zero config out of the box.
 */

export type Channel = "EMAIL" | "SMS" | "WHATSAPP";

export interface NotificationInput {
  userId?: string | null;
  channel?: Channel;
  type: string;
  title: string;
  message: string;
}

interface Provider {
  channel: Channel;
  send(n: NotificationInput): Promise<void>;
}

async function recipientContact(userId: string | null | undefined) {
  if (!userId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, phone: true } });
  return user;
}

class LogProvider implements Provider {
  constructor(public channel: Channel) {}
  async send(n: NotificationInput) {
    console.info(`[${this.channel}] → ${n.userId ?? "broadcast"}: ${n.title} — ${n.message}`);
  }
}

class SendGridEmailProvider implements Provider {
  channel: Channel = "EMAIL";
  private log = new LogProvider("EMAIL");
  async send(n: NotificationInput) {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    if (!apiKey || !fromEmail) return this.log.send(n);

    // Broadcasts (userId null, e.g. admin alerts) have no single user to email — send to the
    // store's own inbox instead, since that's the only configured recipient for "admin" mail.
    const toEmail = n.userId ? (await recipientContact(n.userId))?.email : await getSetting("storeEmail");
    if (!toEmail) return this.log.send(n);

    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: toEmail }] }],
        from: { email: fromEmail },
        subject: n.title,
        content: [{ type: "text/plain", value: n.message }],
      }),
    });
    if (!res.ok) {
      console.error("[notification/sendgrid] send failed", res.status, await res.text().catch(() => ""));
      return this.log.send(n);
    }
  }
}

class TwilioProvider implements Provider {
  private log: LogProvider;
  constructor(
    public channel: "SMS" | "WHATSAPP",
    private fromEnvVar: string
  ) {
    this.log = new LogProvider(channel);
  }
  async send(n: NotificationInput) {
    const sid = process.env.TWILIO_ACCOUNT_SID;
    const token = process.env.TWILIO_AUTH_TOKEN;
    const from = process.env[this.fromEnvVar];
    if (!sid || !token || !from) return this.log.send(n);

    // Broadcasts have no single admin phone number in this schema — only user-scoped
    // notifications (which do have a phone via the user record) send for real.
    const toPhone = n.userId ? (await recipientContact(n.userId))?.phone : null;
    if (!toPhone) return this.log.send(n);

    const prefix = this.channel === "WHATSAPP" ? "whatsapp:" : "";
    const body = new URLSearchParams({ To: `${prefix}${toPhone}`, From: `${prefix}${from}`, Body: `${n.title}: ${n.message}` });
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) {
      console.error(`[notification/twilio-${this.channel}] send failed`, res.status, await res.text().catch(() => ""));
      return this.log.send(n);
    }
  }
}

const providers: Record<Channel, Provider> = {
  EMAIL: new SendGridEmailProvider(),
  SMS: new TwilioProvider("SMS", "TWILIO_SMS_FROM"),
  WHATSAPP: new TwilioProvider("WHATSAPP", "TWILIO_WHATSAPP_FROM"),
};

export async function notify(input: NotificationInput) {
  const channel = input.channel ?? "EMAIL";
  const row = await prisma.notification.create({ data: { ...input, channel } });
  await providers[channel].send({ ...input, channel });
  return row;
}

export async function notifyAdmins(input: Omit<NotificationInput, "userId">) {
  // broadcast row (userId null) — admin bell reads these
  return notify({ ...input, userId: null });
}

// ── Domain events ──

export async function notifyOrderPlaced(order: {
  id: string;
  orderNumber: string;
  total: number;
  userId: string | null;
  email: string;
}) {
  if (order.userId) {
    await notify({
      userId: order.userId,
      type: "ORDER_CONFIRMED",
      title: `Order ${order.orderNumber} placed`,
      message: `Thank you! We've received your order totalling ${formatMoney(order.total)}.`,
    });
  }
  await notifyAdmins({
    type: "ADMIN_NEW_ORDER",
    title: `New order ${order.orderNumber}`,
    message: `${order.email} placed an order of ${formatMoney(order.total)}.`,
  });
}

export async function notifyOrderStatus(order: {
  orderNumber: string;
  userId: string | null;
  status: string;
  trackingNumber?: string | null;
}) {
  if (!order.userId) return;
  const map: Record<string, string> = {
    CONFIRMED: "Your order has been confirmed.",
    PROCESSING: "Your order is being prepared.",
    PACKED: "Your order is packed and ready to ship.",
    SHIPPED: `Your order has shipped${order.trackingNumber ? ` — tracking # ${order.trackingNumber}` : ""}.`,
    DELIVERED: "Your order was delivered. Enjoy!",
    CANCELLED: "Your order was cancelled.",
    RETURNED: "Your return was received.",
    REFUNDED: "Your refund was processed.",
  };
  await notify({
    userId: order.userId,
    type: `ORDER_${order.status}`,
    title: `Order ${order.orderNumber}: ${order.status}`,
    message: map[order.status] ?? `Status updated to ${order.status}.`,
  });
}

export async function notifyLowStock(items: { name: string; stock: number }[]) {
  if (!items.length) return;
  await notifyAdmins({
    type: "ADMIN_LOW_STOCK",
    title: "Low stock alert",
    message: items.map((i) => `${i.name} (${i.stock} left)`).join(", "),
  });
}

export async function listNotifications(opts: { userId?: string | null; unreadOnly?: boolean; limit?: number }) {
  const { userId, unreadOnly, limit = 30 } = opts;
  const where: any = {};
  where.userId = userId ?? null;
  if (unreadOnly) where.isRead = false;
  return prisma.notification.findMany({ where, orderBy: { createdAt: "desc" }, take: limit });
}

export async function markAllRead(userId: string | null) {
  await prisma.notification.updateMany({ where: { userId: userId ?? null, isRead: false }, data: { isRead: true } });
}
