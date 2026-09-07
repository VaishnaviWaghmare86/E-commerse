import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '../types';

export interface StoredAccount extends AdminUser {
  passwordHash: string;
}

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  registeredAccounts: AdminUser[];
  createShopkeeperAccount: (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    storeName?: string;
    phone?: string;
  }) => { success: boolean; message?: string };
}

const STORAGE_AUTH_KEY = 'kidsplay_admin_auth';
const STORAGE_ACCOUNTS_KEY = 'kidsplay_admin_accounts';

// Default pre-configured credentials
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr-admin-01',
    name: 'Super Admin',
    username: 'admin',
    email: 'admin@kidsplaystore.com',
    passwordHash: 'admin123',
    role: 'ADMIN',
    storeName: 'KidsPlay Global HQ',
  },
  {
    id: 'usr-shopkeeper-01',
    name: 'Authorized Shopkeeper',
    username: 'shopkeeper',
    email: 'shopkeeper@kidsplaystore.com',
    passwordHash: 'shopkeeper123',
    role: 'SHOPKEEPER',
    storeName: 'KidsPlay Outlet Store',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accounts store
  const [accounts, setAccounts] = useState<StoredAccount[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load accounts from localStorage', e);
    }
    return DEFAULT_ACCOUNTS;
  });

  // Current session user
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_AUTH_KEY);
      if (savedAuth) {
        return JSON.parse(savedAuth);
      }
    } catch (e) {
      console.error('Failed to load user auth from localStorage', e);
    }
    return null;
  });

  // Persist accounts whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save accounts to localStorage', e);
    }
  }, [accounts]);

  // Persist user auth session
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_AUTH_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth session to localStorage', e);
    }
  }, [user]);

  const login = (identifier: string, password: string): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both username/email and password.' };
    }

    const matched = accounts.find(
      (acc) =>
        (acc.email.toLowerCase() === cleanId || acc.username.toLowerCase() === cleanId) &&
        acc.passwordHash === cleanPass
    );

    if (!matched) {
      return {
        success: false,
        message: 'Invalid credentials. Please verify your username/email and password.',
      };
    }

    const sessionUser: AdminUser = {
      id: matched.id,
      name: matched.name,
      username: matched.username,
      email: matched.email,
      role: matched.role,
      avatar: matched.avatar,
      storeName: matched.storeName,
      phone: matched.phone,
    };

    setUser(sessionUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_AUTH_KEY);
    } catch (e) {
      console.error('Error during logout', e);
    }
  };

  const createShopkeeperAccount = (data: {
    name: string;
    username: string;
    email: string;
    password: string;
    storeName?: string;
    phone?: string;
  }): { success: boolean; message?: string } => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanUsername = data.username.trim().toLowerCase();

    // Check duplicate
    const exists = accounts.some(
      (a) => a.email.toLowerCase() === cleanEmail || a.username.toLowerCase() === cleanUsername
    );

    if (exists) {
      return { success: false, message: 'A user with this username or email already exists.' };
    }

    const newAccount: StoredAccount = {
      id: `usr-shop-${Date.now()}`,
      name: data.name.trim(),
      username: cleanUsername,
      email: cleanEmail,
      passwordHash: data.password.trim(),
      role: 'SHOPKEEPER',
      storeName: data.storeName?.trim() || 'Partner Shop',
      phone: data.phone?.trim(),
    };

    setAccounts((prev) => [...prev, newAccount]);
    return { success: true };
  };

  const registeredAccounts: AdminUser[] = accounts.map(({ passwordHash, ...safeUser }) => safeUser);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        registeredAccounts,
        createShopkeeperAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
