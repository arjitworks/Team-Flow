import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-xl rounded-lg border bg-white p-6">
      <h2 className="text-xl font-semibold">Profile</h2>
      <div className="mt-4 space-y-2 text-sm">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
