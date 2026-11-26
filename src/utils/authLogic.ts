export type UserRole = 'admin' | 'member';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

interface StoredAccount extends AuthUser {
  passwordHash: string;
}

const ACCOUNTS_STORAGE_KEY = 'bluemoon_auth_accounts_v1';
const SESSION_STORAGE_KEY = 'bluemoon_auth_session_v1';

const ADMIN_EMAIL = 'razkaps0809@gmail.com';
const ADMIN_NAME = 'Razka';

function hashPassword(password: string): string {
  // Lightweight deterministic hash for client-side credential verification
  let hash = 2166136261;
  for (let i = 0; i < password.length; i++) {
    hash ^= password.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `bm_${(hash >>> 0).toString(16)}`;
}

const ADMIN_PASSWORD_HASH = hashPassword('Razka311');

function getStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function loadRegisteredAccounts(): StoredAccount[] {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredAccount[]) : [];
  } catch {
    return [];
  }
}

function saveRegisteredAccounts(accounts: StoredAccount[]): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch {
    // Ignore storage quota issues
  }
}

function toPublicUser(account: StoredAccount): AuthUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    createdAt: account.createdAt,
  };
}

export function getCurrentSession(): AuthUser | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    const raw = storage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (
      parsed &&
      typeof parsed.email === 'string' &&
      typeof parsed.name === 'string' &&
      (parsed.role === 'admin' || parsed.role === 'member')
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveSession(user: AuthUser | null): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    if (user) {
      storage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota issues
  }
}

export function logoutUser(): void {
  saveSession(null);
}

export function loginUser(
  rawEmail: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const email = rawEmail.trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return { ok: false, error: 'Masukkan alamat email yang valid.' };
  }
  if (!password) {
    return { ok: false, error: 'Password wajib diisi.' };
  }

  const candidateHash = hashPassword(password);

  if (email === ADMIN_EMAIL) {
    if (candidateHash !== ADMIN_PASSWORD_HASH) {
      return { ok: false, error: 'Email atau password admin salah.' };
    }
    const adminUser: AuthUser = {
      id: 'admin-razka',
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      role: 'admin',
      createdAt: 'Admin Resmi',
    };
    saveSession(adminUser);
    return { ok: true, user: adminUser };
  }

  const accounts = loadRegisteredAccounts();
  const matched = accounts.find((acc) => acc.email.toLowerCase() === email);
  if (!matched || matched.passwordHash !== candidateHash) {
    return { ok: false, error: 'Email atau password tidak sesuai.' };
  }

  const user = toPublicUser(matched);
  saveSession(user);
  return { ok: true, user };
}

export function registerUser(
  rawName: string,
  rawEmail: string,
  password: string,
): { ok: true; user: AuthUser } | { ok: false; error: string } {
  const name = rawName.trim();
  const email = rawEmail.trim().toLowerCase();

  if (name.length < 2) {
    return { ok: false, error: 'Nama lengkap minimal 2 karakter.' };
  }
  if (name.length > 48) {
    return { ok: false, error: 'Nama maksimal 48 karakter.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Format email tidak valid.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Password minimal 6 karakter.' };
  }
  if (email === ADMIN_EMAIL) {
    return {
      ok: false,
      error: 'Email ini sudah terdaftar sebagai akun Admin.',
    };
  }

  const accounts = loadRegisteredAccounts();
  if (accounts.some((acc) => acc.email.toLowerCase() === email)) {
    return {
      ok: false,
      error: 'Email sudah terdaftar. Silakan masuk menggunakan akunmu.',
    };
  }

  const newAccount: StoredAccount = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    email,
    role: 'member',
    createdAt: new Date().toLocaleDateString('id-ID'),
    passwordHash: hashPassword(password),
  };

  saveRegisteredAccounts([newAccount, ...accounts]);
  const user = toPublicUser(newAccount);
  saveSession(user);
  return { ok: true, user };
}
