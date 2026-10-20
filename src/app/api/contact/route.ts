import { z } from "zod";
import { handle, ok, fail, rateLimit, clientIp } from "@/lib/api";
import { notifyAdmins } from "@/services/notification.service";

const schema = z.object({
  name: z.string().min(2, "Name required"),
  company: z.string().max(160).optional().nullable(),
  email: z.string().email("Valid email required"),
  phone: z.string().max(40).optional().nullable(),
  intent: z.enum(["question", "sample", "quote", "private-label", "visit"]).default("question"),
  product: z.string().max(160).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const POST = handle(async (req: Request) => {
  if (!(await rateLimit(`contact:${clientIp(req)}`, 5, 60_000))) return fail("Too many messages. Try later.", 429);
  const input = schema.parse(await req.json());
  await notifyAdmins({
    type: "ADMIN_CONTACT",
    title: `${input.intent === "question" ? "Contact" : "Buyer inquiry"}: ${input.name}`,
    message: [
      `Email: ${input.email}`,
      input.phone ? `Phone: ${input.phone}` : null,
      input.company ? `Company: ${input.company}` : null,
      input.product ? `Product: ${input.product}` : null,
      `Need: ${input.intent}`,
      input.message,
    ].filter(Boolean).join("\n"),
  });
  return ok({ sent: true, message: "The house has your note. We usually reply within 24 hours." });
});
