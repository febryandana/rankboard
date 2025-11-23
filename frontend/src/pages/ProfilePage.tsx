import { useAuth } from '../hooks/useAuth';
import ProfileForm from '../components/profile/ProfileForm';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <ProfileForm user={user} />
    </div>
  );
}
