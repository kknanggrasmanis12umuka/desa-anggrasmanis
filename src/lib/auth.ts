// src/lib/auth.ts (Updated to match backend)
import Cookies from 'js-cookie'; // Pastikan ini diimport

export interface DecodedToken {
  sub: string;
  email: string;
  username: string;
  role: string; // String from backend, not enum
  iat?: number;
  exp?: number;
}

export const authUtils = {
  setToken: (token: string, refreshToken?: string) => {
    localStorage.setItem('token', token);
    Cookies.set('token', token, { expires: 7 });
    if (refreshToken) {
      Cookies.set('refreshToken', refreshToken, { expires: 30 });
    }
  },
  
  getRefreshToken: () => {
    return Cookies.get('refreshToken');
  },
  
  removeRefreshToken: () => {
    Cookies.remove('refreshToken');
  },
  
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    Cookies.remove('token');
    Cookies.remove('refreshToken');
  }
};

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Try localStorage first (for compatibility with existing code)
  let token = localStorage.getItem('token');
  
  // Fallback to cookie
  if (!token) {
    token = getCookie('token');
  }
  
  return token;
}

export function setToken(token: string): void {
  // Store in both localStorage and cookie for better security and SSR support
  localStorage.setItem('token', token);
  setCookie('token', token, 7); // 7 days
}

export function removeToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  deleteCookie('token');
}

export function decodeToken(token: string): DecodedToken | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.role || null;
}

// Role hierarchy based on your Prisma schema
export const roleHierarchy = {
  'OPERATOR': 1,  // Default role, can manage services
  'EDITOR': 2,    // Can manage content (posts, events)
  'ADMIN': 3      // Full access to everything
} as const;

export function hasPermission(
  userRole: string,
  requiredRole: keyof typeof roleHierarchy
): boolean {
  const normalizedUserRole = userRole?.toUpperCase?.() as keyof typeof roleHierarchy;
  const normalizedRequiredRole = requiredRole?.toUpperCase?.() as keyof typeof roleHierarchy;

  const userLevel = roleHierarchy[normalizedUserRole];
  const requiredLevel = roleHierarchy[normalizedRequiredRole];

  console.log('👤 Checking permission:', normalizedUserRole, 'needs', normalizedRequiredRole);

  if (userLevel === undefined || requiredLevel === undefined) {
    return false; // Unknown role
  }

  return userLevel >= requiredLevel;
}


export function canAccessAdminPanel(userRole?: string): boolean {
  if (!userRole) return false;
  return ['ADMIN', 'EDITOR', 'OPERATOR'].includes(userRole);
}

export function canManagePosts(userRole?: string): boolean {
  if (!userRole) return false;
  return ['ADMIN', 'EDITOR'].includes(userRole);
}

export function canManageUsers(userRole?: string): boolean {
  if (!userRole) return false;
  return userRole === 'ADMIN';
}

export function canManageServices(userRole?: string): boolean {
  if (!userRole) return false;
  return ['ADMIN', 'OPERATOR'].includes(userRole);
}

export function canManageUMKM(userRole?: string): boolean {
  if (!userRole) return false;
  return ['ADMIN', 'OPERATOR'].includes(userRole);
}

export function canManageEvents(userRole?: string): boolean {
  if (!userRole) return false;
  return ['ADMIN', 'EDITOR'].includes(userRole);
}

export function canManageVillageProfile(userRole?: string): boolean {
  if (!userRole) return false;
  return userRole === 'ADMIN';
}

// Cookie utilities
function setCookie(name: string, value: string, days: number): void {
  if (typeof window === 'undefined') return;
  
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure=${location.protocol === 'https:'}`;
}

function getCookie(name: string): string | null {
  if (typeof window === 'undefined') return null;
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  
  return null;
}

function deleteCookie(name: string): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Client-side route protection hook
export function useRouteProtection() {
  const getUserFromHeaders = () => {
    if (typeof window === 'undefined') return null;
    
    // Get user info from response headers set by middleware
    const userId = document.querySelector('meta[name="x-user-id"]')?.getAttribute('content');
    const userRole = document.querySelector('meta[name="x-user-role"]')?.getAttribute('content');
    const userEmail = document.querySelector('meta[name="x-user-email"]')?.getAttribute('content');
    
    if (userId && userRole && userEmail) {
      return { id: userId, role: userRole, email: userEmail };
    }
    
    return null;
  };
  

  return {
    getUserFromHeaders,
    hasPermission,
    canAccessAdminPanel,
    canManagePosts,
    canManageUsers,
    canManageServices
  };
}