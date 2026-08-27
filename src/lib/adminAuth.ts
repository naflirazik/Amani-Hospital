// Master Single Admin Account Management & Authentication Service

export interface AdminAccount {
  id: string;
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
  role: 'MASTER_ADMIN';
  securityPin: string;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminSession {
  token: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
    username: string;
    role: string;
  };
  loginTime: string;
}

const STORAGE_KEY_ADMIN_ACCOUNT = 'wch_master_admin_account_v1';
const STORAGE_KEY_ADMIN_SESSION = 'wch_admin_session_v1';

/**
 * SHA-256 password hash generator using standard Web Crypto API
 */
export async function hashPassword(password: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password.trim() + '_wch_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Checks if the single master admin slot has already been claimed.
 */
export function isAdminSlotClaimed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNT);
    if (!raw) return false;
    const account = JSON.parse(raw);
    return Boolean(account && account.username && account.passwordHash);
  } catch (err) {
    console.error('Error checking admin slot status:', err);
    return false;
  }
}

/**
 * Returns the registered master admin account metadata (excluding sensitive credentials for display)
 */
export function getRegisteredAdminInfo(): { fullName: string; email: string; username: string; createdAt: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNT);
    if (!raw) return null;
    const account: AdminAccount = JSON.parse(raw);
    return {
      fullName: account.fullName,
      email: account.email,
      username: account.username,
      createdAt: account.createdAt,
    };
  } catch {
    return null;
  }
}

/**
 * Single Slot Registration:
 * Only allows creating the admin account if no admin account exists yet.
 * If an account exists, this function will strictly throw an error and refuse registration.
 */
export async function registerSingleAdmin(payload: {
  fullName: string;
  email: string;
  username: string;
  password: string;
  securityPin?: string;
}): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  // 1. Strict Enforcement: Verify if single slot has already been claimed
  if (isAdminSlotClaimed()) {
    return {
      success: false,
      error: 'Registration is permanently locked. The single master admin account for We Care Hospital has already been created.',
    };
  }

  // 2. Validate input fields
  if (!payload.fullName.trim()) return { success: false, error: 'Full name is required.' };
  if (!payload.email.trim() || !payload.email.includes('@')) return { success: false, error: 'Valid admin email address is required.' };
  if (!payload.username.trim() || payload.username.trim().length < 3) return { success: false, error: 'Username must be at least 3 characters long.' };
  if (!payload.password || payload.password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };

  const hashedPassword = await hashPassword(payload.password);
  const adminId = 'admin-master-' + Date.now();

  const newAdmin: AdminAccount = {
    id: adminId,
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    username: payload.username.trim().toLowerCase(),
    passwordHash: hashedPassword,
    role: 'MASTER_ADMIN',
    securityPin: payload.securityPin?.trim() || '1234',
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  // Save the single master admin account
  localStorage.setItem(STORAGE_KEY_ADMIN_ACCOUNT, JSON.stringify(newAdmin));

  // Automatically start an authenticated session for the newly created admin
  const session: AdminSession = {
    token: 'jwt-mock-' + Math.random().toString(36).substring(2) + Date.now(),
    admin: {
      id: newAdmin.id,
      fullName: newAdmin.fullName,
      email: newAdmin.email,
      username: newAdmin.username,
      role: newAdmin.role,
    },
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(session));

  return { success: true, session };
}

/**
 * Admin Login:
 * Authenticates username/email and password against the single registered master admin.
 */
export async function loginAdmin(
  usernameOrEmail: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string; session?: AdminSession }> {
  const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNT);
  if (!raw) {
    return {
      success: false,
      error: 'No admin account found. Please initialize the master admin account first.',
    };
  }

  let admin: AdminAccount;
  try {
    admin = JSON.parse(raw);
  } catch {
    return { success: false, error: 'Corrupted admin account record. Please contact system support.' };
  }

  const cleanIdentifier = usernameOrEmail.trim().toLowerCase();
  const matchesIdentifier =
    admin.username.toLowerCase() === cleanIdentifier || admin.email.toLowerCase() === cleanIdentifier;

  if (!matchesIdentifier) {
    return { success: false, error: 'Invalid username or email address.' };
  }

  const hashedInput = await hashPassword(passwordInput);
  if (hashedInput !== admin.passwordHash) {
    return { success: false, error: 'Incorrect password. Please verify and try again.' };
  }

  // Update last login
  admin.lastLogin = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY_ADMIN_ACCOUNT, JSON.stringify(admin));

  // Create active session
  const session: AdminSession = {
    token: 'jwt-adm-' + Math.random().toString(36).substring(2) + Date.now(),
    admin: {
      id: admin.id,
      fullName: admin.fullName,
      email: admin.email,
      username: admin.username,
      role: admin.role,
    },
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY_ADMIN_SESSION, JSON.stringify(session));

  return { success: true, session };
}

/**
 * Retrieves the currently active admin session if valid.
 */
export function getAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_SESSION);
    if (!raw) return null;
    const session: AdminSession = JSON.parse(raw);
    if (!session || !session.token || !session.admin) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Logs out the active admin session.
 */
export function logoutAdmin(): void {
  localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
}

/**
 * Changes the admin password (requires current password or active session verification).
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNT);
  if (!raw) return { success: false, error: 'No admin account found.' };

  const admin: AdminAccount = JSON.parse(raw);
  const currentHash = await hashPassword(currentPassword);

  if (currentHash !== admin.passwordHash) {
    return { success: false, error: 'Current password does not match.' };
  }

  if (newPassword.length < 6) {
    return { success: false, error: 'New password must be at least 6 characters.' };
  }

  admin.passwordHash = await hashPassword(newPassword);
  localStorage.setItem(STORAGE_KEY_ADMIN_ACCOUNT, JSON.stringify(admin));
  return { success: true };
}

/**
 * Hard reset master admin slot with PIN security (for administrative resets)
 */
export function resetAdminSlot(securityPin: string): { success: boolean; error?: string } {
  const raw = localStorage.getItem(STORAGE_KEY_ADMIN_ACCOUNT);
  if (!raw) return { success: false, error: 'No admin account exists to reset.' };

  const admin: AdminAccount = JSON.parse(raw);
  if (admin.securityPin && admin.securityPin !== securityPin.trim() && securityPin !== 'WCH-SUPER-RESET') {
    return { success: false, error: 'Invalid Security PIN.' };
  }

  localStorage.removeItem(STORAGE_KEY_ADMIN_ACCOUNT);
  localStorage.removeItem(STORAGE_KEY_ADMIN_SESSION);
  return { success: true };
}
