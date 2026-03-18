'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const { logout } = usePrivy();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('strimzUser');
      toast.success('Logged out successfully', {
        position: 'top-right',
      });
      router.push('/auth');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Failed to logout', {
        position: 'top-right',
      });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  );
}