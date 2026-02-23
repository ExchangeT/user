import { create } from 'zustand';
import { User, BetSlipItem, Match, Market } from '@/types';
import { currentUser, walletData } from '@/lib/mock-data';

// User Store
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: currentUser,
  isAuthenticated: true,
  isLoading: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null,
  })),
}));

// Bet Slip Store
interface BetSlipState {
  items: BetSlipItem[];
  isOpen: boolean;
  addBet: (item: BetSlipItem) => void;
  removeBet: (marketId: string) => void;
  updateStake: (marketId: string, stake: number) => void;
  clearSlip: () => void;
  toggleSlip: () => void;
  getTotalStake: () => number;
  getTotalPotentialPayout: () => number;
}

export const useBetSlipStore = create<BetSlipState>((set, get) => ({
  items: [],
  isOpen: false,
  addBet: (item) => set((state) => {
    const exists = state.items.find((i) => i.marketId === item.marketId);
    if (exists) {
      return {
        items: state.items.map((i) =>
          i.marketId === item.marketId ? item : i
        ),
      };
    }
    return { items: [...state.items, item], isOpen: true };
  }),
  removeBet: (marketId) => set((state) => ({
    items: state.items.filter((i) => i.marketId !== marketId),
  })),
  updateStake: (marketId, stake) => set((state) => ({
    items: state.items.map((i) =>
      i.marketId === marketId ? { ...i, stake } : i
    ),
  })),
  clearSlip: () => set({ items: [] }),
  toggleSlip: () => set((state) => ({ isOpen: !state.isOpen })),
  getTotalStake: () => get().items.reduce((sum, item) => sum + item.stake, 0),
  getTotalPotentialPayout: () =>
    get().items.reduce((sum, item) => sum + item.stake * item.odds, 0),
}));

// Wallet Store
interface WalletState {
  totalBalance: number;
  availableBalance: number;
  lockedBalance: number;
  balances: typeof walletData.balances;
  isLoading: boolean;
  refreshBalance: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  ...walletData,
  isLoading: false,
  refreshBalance: async () => {
    set({ isLoading: true });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    set({ ...walletData, isLoading: false });
  },
}));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  activeTab: string;
  modalOpen: string | null;
  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  closeMobileSidebar: () => void;
  setActiveTab: (tab: string) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  mobileSidebarOpen: false,
  activeTab: 'dashboard',
  modalOpen: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  openModal: (modalId) => set({ modalOpen: modalId }),
  closeModal: () => set({ modalOpen: null }),
}));

// Match Store
interface MatchState {
  selectedMatch: Match | null;
  selectedMarket: Market | null;
  liveMatches: Match[];
  upcomingMatches: Match[];
  setSelectedMatch: (match: Match | null) => void;
  setSelectedMarket: (market: Market | null) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  selectedMatch: null,
  selectedMarket: null,
  liveMatches: [],
  upcomingMatches: [],
  setSelectedMatch: (match) => set({ selectedMatch: match }),
  setSelectedMarket: (market) => set({ selectedMarket: market }),
}));
