import { useAppSelector } from '@/store';

export function usePermissions() {
  const { user } = useAppSelector(state => state.auth);

  const hasPermission = (roles: string[]) => {
    if (!user || !user.roles) {
      return false;
    }

    return roles.some(role => user.roles.includes(role));
  };

  const getUserRoles = () => {
    return user ? user.roles : [];
  };

  return { hasPermission, getUserRoles };
}
