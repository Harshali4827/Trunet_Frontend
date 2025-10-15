
export const hasPermission = (permissions, module, requiredPermissions = []) => {
    const modulePermissions = permissions.find(p => p.module === module)
    if (!modulePermissions) return false
    return requiredPermissions.some(p => modulePermissions.permissions.includes(p))
  }
  