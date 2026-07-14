import { getAdmin } from "@/lib/session";
import { listVersions, type Version } from "@/lib/db";
import { isBlobConfigured } from "@/lib/storage";
import LoginForm from "@/components/admin/LoginForm";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Hush · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const admin = await getAdmin();
  if (!admin) return <LoginForm />;

  let versions: Version[] = [];
  try {
    versions = await listVersions();
  } catch {
    versions = [];
  }

  return (
    <AdminDashboard
      username={admin}
      versions={versions}
      blobConfigured={isBlobConfigured()}
    />
  );
}
