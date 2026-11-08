import { requireAuth } from "@/lib/auth-helpers";
import PasswordClient from "@/components/admin/PasswordClient";

export const dynamic = "force-dynamic";

export default async function AdminAccountPage() {
  const session = await requireAuth();
  return <PasswordClient email={session.email} />;
}
