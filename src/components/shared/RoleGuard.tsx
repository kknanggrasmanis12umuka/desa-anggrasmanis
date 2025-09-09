'use client';

import { useAuth } from '@/hooks/useAuth';
import { hasPermission, roleHierarchy } from '@/lib/auth';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: keyof typeof roleHierarchy;
  allowedRoles?: (keyof typeof roleHierarchy)[];
  fallback?: ReactNode;
  showFallback?: boolean;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  allowedRoles,
  fallback,
  showFallback = true 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth(); // Gunakan useAuth() bukan useAuthContext()

  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  // Check permissions
  let hasAccess = false;
  
  if (allowedRoles) {
    hasAccess = allowedRoles.some(role => user && hasPermission(user.role, role));
  } else if (requiredRole && user) {
    hasAccess = hasPermission(user.role, requiredRole);
  }

  // No user or insufficient permissions
  if (!user || !hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    if (showFallback) {
      const requiredRolesText = allowedRoles 
        ? allowedRoles.join(' atau ') 
        : requiredRole;

      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                Anda memerlukan role <span className="font-semibold">{requiredRolesText}</span> untuk mengakses konten ini.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return null;
  }

  return <>{children}</>;
}

// Specific role guards
export function AdminOnly({ children, fallback, showFallback = true }: Omit<RoleGuardProps, 'requiredRole' | 'allowedRoles'>) {
  return (
    <RoleGuard requiredRole="ADMIN" fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  );
}

export function EditorAndAbove({ children, fallback, showFallback = true }: Omit<RoleGuardProps, 'requiredRole' | 'allowedRoles'>) {
  return (
    <RoleGuard requiredRole="EDITOR" fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  );
}

export function OperatorAndAbove({ children, fallback, showFallback = true }: Omit<RoleGuardProps, 'requiredRole' | 'allowedRoles'>) {
  return (
    <RoleGuard requiredRole="OPERATOR" fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  );
}

export function AnyRole({ children, allowedRoles, fallback, showFallback = true }: Omit<RoleGuardProps, 'requiredRole'>) {
  return (
    <RoleGuard allowedRoles={allowedRoles} fallback={fallback} showFallback={showFallback}>
      {children}
    </RoleGuard>
  );
}