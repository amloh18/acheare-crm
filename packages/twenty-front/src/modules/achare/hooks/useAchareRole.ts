import { useState, useEffect, useCallback } from 'react';
import { AchareRole, ACHARE_ROLES, AchareRoleConfig } from '../types/achareRole';

const STORAGE_KEY = 'achare_active_role';
const ROLE_CHANGE_EVENT = 'achare_role_changed';

export const useAchareRole = () => {
  const [role, setRoleState] = useState<AchareRole>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as AchareRole;
      if (stored && ACHARE_ROLES.some((r) => r.id === stored)) {
        return stored;
      }
    } catch {
      // Ignore storage errors
    }
    return 'admin';
  });

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setRoleState(e.newValue as AchareRole);
      }
    };
    const handleCustom = (e: Event) => {
      const customEvent = e as CustomEvent<AchareRole>;
      if (customEvent.detail) {
        setRoleState(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(ROLE_CHANGE_EVENT, handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(ROLE_CHANGE_EVENT, handleCustom);
    };
  }, []);

  const setRole = useCallback((newRole: AchareRole) => {
    try {
      localStorage.setItem(STORAGE_KEY, newRole);
    } catch {
      // Ignore storage errors
    }
    setRoleState(newRole);
    window.dispatchEvent(
      new CustomEvent<AchareRole>(ROLE_CHANGE_EVENT, { detail: newRole }),
    );
  }, []);

  const roleConfig = ACHARE_ROLES.find((r) => r.id === role) as AchareRoleConfig;

  return {
    role,
    setRole,
    roleConfig,
    allRoles: ACHARE_ROLES,
  };
};
