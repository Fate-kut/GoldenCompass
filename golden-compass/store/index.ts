import { create } from 'zustand';
import { POOLS } from '@/constants/theme';

export type UserRole = 'investor' | 'admin' | 'compliance' | 'auditor';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'not_started';
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  mpesaReference: string;
  poolId?: string;
  poolName?: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt: string;
}

export interface UserInvestment {
  poolId: string;
  unitsOwned: number;
  investedAmount: number;
  currentValue: number;
}

export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actor: string;
  timestamp: string;
}

interface AppState {
  // Auth
  currentUser: User | null;
  isLoggedIn: boolean;

  // Portfolio
  investments: UserInvestment[];
  transactions: Transaction[];

  // Admin
  pendingKYC: Array<{ id: string; name: string; risk: string; submittedAt: string }>;
  auditLogs: AuditLog[];
  amlFlags: Array<{ id: string; txnRef: string; amount: number; user: string; reason: string }>;

  // Actions
  login: (email: string, password: string) => boolean;
  adminLogin: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  deposit: (amount: number, poolId?: string, phone?: string) => Promise<Transaction>;
  withdraw: (amount: number, poolId: string) => Promise<Transaction>;
  invest: (amount: number, poolId: string) => Promise<void>;
  updateNAV: (poolId: string, newNAV: number, totalValue: number, notes: string) => void;
  approveKYC: (userId: string) => void;
  rejectKYC: (userId: string) => void;
  addAuditLog: (action: string, entityType: string, entityId: string, actor: string) => void;
}

const MOCK_USERS = [
  {
    id: 'usr_001',
    fullName: 'James Mwangi',
    email: 'demo@compass.co.ke',
    phone: '+254700000000',
    role: 'investor' as UserRole,
    avatar: 'JM',
    kycStatus: 'approved' as const,
    password: 'password123',
  },
];

const MOCK_INVESTMENTS: UserInvestment[] = [
  { poolId: 'bahari', unitsOwned: 752.3, investedAmount: 70000, currentValue: 76192 },
  { poolId: 'pwani', unitsOwned: 496.2, investedAmount: 46800, currentValue: 48658 },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'PBK8234JH', userId: 'usr_001', type: 'deposit', amount: 5000, mpesaReference: 'SI7234KLA', poolName: 'Wallet', status: 'confirmed', createdAt: '2026-02-27T14:22:00Z' },
  { id: 'PBK7892KJ', userId: 'usr_001', type: 'deposit', amount: 10000, mpesaReference: 'SI6891LKA', poolId: 'bahari', poolName: 'Bahari Growth Fund', status: 'confirmed', createdAt: '2026-02-26T10:05:00Z' },
  { id: 'PBK7112KA', userId: 'usr_001', type: 'withdrawal', amount: 2500, mpesaReference: 'SI5734JKA', poolId: 'pwani', poolName: 'Pwani Stable Fund', status: 'confirmed', createdAt: '2026-02-22T09:15:00Z' },
  { id: 'PBK6881XA', userId: 'usr_001', type: 'deposit', amount: 20000, mpesaReference: 'SI4521LKA', poolId: 'kilima', poolName: 'Kilima Balanced Fund', status: 'confirmed', createdAt: '2026-02-15T16:40:00Z' },
  { id: 'PBK5421KA', userId: 'usr_001', type: 'withdrawal', amount: 8000, mpesaReference: 'SI3398JKA', poolId: 'bahari', poolName: 'Bahari Growth Fund', status: 'confirmed', createdAt: '2026-02-10T11:30:00Z' },
  { id: 'PBK4122XA', userId: 'usr_001', type: 'deposit', amount: 50000, mpesaReference: 'SI2156LKA', poolId: 'bahari', poolName: 'Bahari Growth Fund', status: 'confirmed', createdAt: '2026-01-30T08:00:00Z' },
];

const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'al_001', action: 'NAV_UPDATE', entityType: 'pool', entityId: 'bahari', actor: 'admin', timestamp: '2026-03-01T06:00:00Z' },
  { id: 'al_002', action: 'KYC_APPROVED', entityType: 'user', entityId: 'usr_001', actor: 'compliance', timestamp: '2026-03-01T08:32:00Z' },
  { id: 'al_003', action: 'NAV_UPDATE', entityType: 'pool', entityId: 'pwani', actor: 'admin', timestamp: '2026-03-01T06:00:00Z' },
  { id: 'al_004', action: 'POOL_CREATED', entityType: 'pool', entityId: 'kilima', actor: 'admin', timestamp: '2026-02-20T09:00:00Z' },
  { id: 'al_005', action: 'AML_FLAGGED', entityType: 'transaction', entityId: 'PBK9921XK', actor: 'system', timestamp: '2026-02-28T14:00:00Z' },
];

export const useStore = create<AppState>((set, get) => ({
  currentUser: null,
  isLoggedIn: false,
  investments: MOCK_INVESTMENTS,
  transactions: MOCK_TRANSACTIONS,
  pendingKYC: [
    { id: 'kyc_001', name: 'Amina Hassan', risk: 'Low', submittedAt: '2026-03-01T07:30:00Z' },
    { id: 'kyc_002', name: 'David Omondi', risk: 'Medium', submittedAt: '2026-03-01T04:00:00Z' },
    { id: 'kyc_003', name: 'Grace Wanjiku', risk: 'Low', submittedAt: '2026-02-29T20:10:00Z' },
  ],
  auditLogs: INITIAL_AUDIT_LOGS,
  amlFlags: [
    { id: 'aml_001', txnRef: 'PBK9921XK', amount: 950000, user: 'John Doe', reason: 'Exceeds 24h threshold' },
  ],

  login: (email, password) => {
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...safeUser } = user;
      set({ currentUser: safeUser, isLoggedIn: true });
      get().addAuditLog('USER_LOGIN', 'user', user.id, user.email);
      return true;
    }
    return false;
  },

  adminLogin: (email, password) => {
    if (email === 'admin@compass.co.ke' && password === 'admin123') {
      set({
        currentUser: { id: 'admin_001', fullName: 'Admin', email, phone: '', role: 'admin', avatar: 'AD', kycStatus: 'approved' },
        isLoggedIn: true,
      });
      return true;
    }
    return false;
  },

  register: (name, email, phone, password) => {
    const newUser: User = {
      id: 'usr_' + Date.now(),
      fullName: name,
      email,
      phone,
      role: 'investor',
      avatar: name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
      kycStatus: 'not_started',
    };
    set({ currentUser: newUser, isLoggedIn: true });
    get().addAuditLog('USER_REGISTERED', 'user', newUser.id, email);
    return true;
  },

  logout: () => {
    get().addAuditLog('USER_LOGOUT', 'user', get().currentUser?.id || '', get().currentUser?.email || '');
    set({ currentUser: null, isLoggedIn: false });
  },

  deposit: async (amount, poolId, phone) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tx: Transaction = {
          id: 'PBK' + Math.floor(Math.random() * 9000 + 1000) + 'XA',
          userId: get().currentUser?.id || '',
          type: 'deposit',
          amount,
          mpesaReference: 'SI' + Math.floor(Math.random() * 9000 + 1000) + 'LKA',
          poolId,
          poolName: poolId ? POOLS[poolId as keyof typeof POOLS]?.name : 'Wallet',
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ transactions: [tx, ...state.transactions] }));
        get().addAuditLog('DEPOSIT_CONFIRMED', 'transaction', tx.id, 'system');

        if (poolId) {
          const pool = POOLS[poolId as keyof typeof POOLS];
          const units = amount / pool.nav;
          set(state => {
            const inv = state.investments.find(i => i.poolId === poolId);
            if (inv) {
              return {
                investments: state.investments.map(i =>
                  i.poolId === poolId
                    ? { ...i, unitsOwned: i.unitsOwned + units, investedAmount: i.investedAmount + amount, currentValue: i.currentValue + amount }
                    : i
                ),
              };
            } else {
              return {
                investments: [...state.investments, { poolId, unitsOwned: units, investedAmount: amount, currentValue: amount }],
              };
            }
          });
        }
        resolve(tx);
      }, 3000);
    });
  },

  withdraw: async (amount, poolId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const tx: Transaction = {
          id: 'PBK' + Math.floor(Math.random() * 9000 + 1000) + 'WA',
          userId: get().currentUser?.id || '',
          type: 'withdrawal',
          amount,
          mpesaReference: 'SI' + Math.floor(Math.random() * 9000 + 1000) + 'JKA',
          poolId,
          poolName: POOLS[poolId as keyof typeof POOLS]?.name,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        set(state => ({ transactions: [tx, ...state.transactions] }));
        get().addAuditLog('WITHDRAWAL_CONFIRMED', 'transaction', tx.id, 'system');
        resolve(tx);
      }, 1500);
    });
  },

  invest: async (amount, poolId) => {
    await get().deposit(amount, poolId);
  },

  updateNAV: (poolId, newNAV, totalValue, notes) => {
    get().addAuditLog('NAV_UPDATE', 'pool', poolId, get().currentUser?.email || 'admin');
  },

  approveKYC: (userId) => {
    set(state => ({ pendingKYC: state.pendingKYC.filter(k => k.id !== userId) }));
    get().addAuditLog('KYC_APPROVED', 'user', userId, get().currentUser?.email || 'admin');
  },

  rejectKYC: (userId) => {
    set(state => ({ pendingKYC: state.pendingKYC.filter(k => k.id !== userId) }));
    get().addAuditLog('KYC_REJECTED', 'user', userId, get().currentUser?.email || 'admin');
  },

  addAuditLog: (action, entityType, entityId, actor) => {
    const log: AuditLog = {
      id: 'al_' + Date.now(),
      action,
      entityType,
      entityId,
      actor,
      timestamp: new Date().toISOString(),
    };
    set(state => ({ auditLogs: [log, ...state.auditLogs] }));
  },
}));
