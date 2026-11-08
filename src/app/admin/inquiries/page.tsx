import Link from "next/link";
import { requireAuth } from "@/lib/auth-helpers";
import prisma from "@/lib/db";
import { cn, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "quote", label: "Quotes" },
  { key: "contact", label: "Messages" },
] as const;

function parseNote(message: string) {
  const fields: Record<string, string> = {};
  const body: string[] = [];
  for (const line of message.split("\n")) {
    const match = line.match(/^(Email|Phone|Company|Product|Need): (.*)$/);
    if (match && body.length === 0) fields[match[1].toLowerCase()] = match[2];
    else body.push(line);
  }
  return {
    email: fields.email || "",
    phone: fields.phone || "",
    company: fields.company || "",
    product: fields.product || "",
    need: fields.need || "",
    message: body.join("\n").trim(),
  };
}

export default async function AdminInquiriesPage(props: { searchParams: Promise<Record<string, string | undefined>> }) {
  const searchParams = await props.searchParams;
  await requireAuth();
  const q = (searchParams.q || "").trim();
  const kind = FILTERS.some((filter) => filter.key === searchParams.kind) ? searchParams.kind! : "all";
  const page = Math.max(1, Number(searchParams.page) || 1);
  const limit = 20;

  const where: {
    userId: null;
    type: string;
    title?: { startsWith: string };
    OR?: { title?: { contains: string; mode: "insensitive" }; message?: { contains: string; mode: "insensitive" } }[];
  } = { userId: null, type: "ADMIN_CONTACT" };
  if (kind === "quote") where.title = { startsWith: "Buyer inquiry" };
  if (kind === "contact") where.title = { startsWith: "Contact" };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { message: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, rows] = await Promise.all([
    prisma.notification.count({ where }),
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);
  const pages = Math.max(1, Math.ceil(total / limit));
  const href = (nextPage: number, nextKind = kind) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (nextKind !== "all") params.set("kind", nextKind);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `/admin/inquiries?${query}` : "/admin/inquiries";
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">Inquiries</h1>
          <p className="text-sm text-ink/50">
            {total} saved {total === 1 ? "request" : "requests"}. Quote and contact forms are stored here. They are not orders.
          </p>
        </div>
        <form method="GET" className="flex gap-3">
          {kind !== "all" ? <input type="hidden" name="kind" value={kind} /> : null}
          <input name="q" defaultValue={q} placeholder="Search name, email, phone…" className="admin-input max-w-xs" />
          <button className="admin-btn-outline">Search</button>
        </form>
      </div>

      <div className="mb-4 flex gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.key}
            href={href(1, filter.key)}
            className={cn(
              "border px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em]",
              kind === filter.key ? "border-brand bg-brand text-cream" : "border-line bg-white text-ink",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="space-y-4">
        {rows.map((row) => {
          const note = parseNote(row.message);
          const quote = row.title.startsWith("Buyer inquiry");
          const name = row.title.replace(/^(Buyer inquiry|Contact):\s*/, "");
          return (
            <article key={row.id} className="admin-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-serif text-xl">{name}</p>
                  <p className="mt-1 text-xs text-ink/50">{formatDateTime(row.createdAt)}</p>
                </div>
                <span className={cn("badge", quote ? "bg-brand text-cream" : "bg-sand text-ink")}>
                  {quote ? "Quote" : "Message"}
                </span>
              </div>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="admin-label">Email</dt>
                  <dd>{note.email ? <a className="hover:underline" href={`mailto:${note.email}`}>{note.email}</a> : "—"}</dd>
                </div>
                <div>
                  <dt className="admin-label">Phone</dt>
                  <dd>{note.phone || "—"}</dd>
                </div>
                <div>
                  <dt className="admin-label">Company</dt>
                  <dd>{note.company || "—"}</dd>
                </div>
                <div>
                  <dt className="admin-label">Need</dt>
                  <dd>{[note.need, note.product].filter(Boolean).join(" · ") || "—"}</dd>
                </div>
              </dl>
              {note.message ? <p className="mt-4 whitespace-pre-wrap border-t border-line pt-4 text-sm leading-6">{note.message}</p> : null}
            </article>
          );
        })}
        {rows.length === 0 && (
          <div className="admin-card py-12 text-center text-sm text-ink/40">
            No inquiries yet. A “Request a quote” on Buyers or a “Send message” on Contact will appear here after it is sent.
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="mt-4 flex gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <Link key={i} href={href(i + 1)} className={cn("border px-3 py-1.5 text-xs font-semibold", page === i + 1 ? "border-brand bg-brand text-cream" : "border-line bg-white")}>
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
