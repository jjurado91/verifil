import { getAdminProfile } from "@/lib/admin-auth";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const profile = await getAdminProfile();

  return (
    <div>
      <h1 className="text-xl font-extrabold text-slate-900">Profile</h1>
      <div className="mt-4 max-w-lg">
        <ProfileForm
          name={profile?.name ?? ""}
          email={profile?.email ?? ""}
          isSuperAdmin={Boolean(profile?.is_superadmin)}
        />
      </div>
    </div>
  );
}
