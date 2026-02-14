// src/hooks/usePermission.js
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';

const usePermission = () => {
  const { permissions, isSuperAdmin} = useContext(AuthContext);

  const hasPermission = (module, perm) => {
    if (isSuperAdmin) return true;
    const moduleObj = permissions.find(p => p.module === module);
    return moduleObj?.permissions.includes(perm);
  };

  const hasAnyPermission = (module, perms = []) => {
    if (isSuperAdmin) return true;
    const moduleObj = permissions.find(p => p.module === module);
    if (!moduleObj) return false;
    return perms.some(p => moduleObj.permissions.includes(p));
  };

  return { hasPermission, hasAnyPermission, isSuperAdmin};
};

export default usePermission;
