// src/hooks/usePermission.js
import { useContext } from 'react';
import { AuthContext } from 'src/context/AuthContext';

const usePermission = () => {
  const { permissions } = useContext(AuthContext);

  // Check if user has a permission in a module
  const hasPermission = (module, perm) => {
    const moduleObj = permissions.find(p => p.module === module);
    return moduleObj?.permissions.includes(perm);
  };

  // Check if user has any permission from a list
  const hasAnyPermission = (module, perms = []) => {
    const moduleObj = permissions.find(p => p.module === module);
    if (!moduleObj) return false;
    return perms.some(p => moduleObj.permissions.includes(p));
  };

  return { hasPermission, hasAnyPermission };
};

export default usePermission;
