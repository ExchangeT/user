import { Match, Market, Prediction, Wallet, User, Transaction, Referral, AppNotification } from '@/types';

// API Response type wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

class ApiClient {
    private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const defaultHeaders: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const response = await fetch(`/api${endpoint}`, {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
        });

        const data: ApiResponse<T> = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || 'API Request failed');
        }

        return data.data as T;
    }

    // --- Auth & User ---
    async getMe() {
        return this.fetch<User>('/auth/me');
    }

    // --- Matches ---
    async getMatches(params?: { status?: string; search?: string; page?: number }) {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return this.fetch<PaginatedResponse<Match>>(`/matches?${qs}`);
    }

    async getMatchDetail(id: string) {
        return this.fetch<Match>(`/matches/${id}`);
    }

    // --- Markets ---
    async getMarkets(matchId: string) {
        return this.fetch<PaginatedResponse<Market>>(`/markets?matchId=${matchId}`);
    }

    // --- Predictions ---
    async getMyPredictions(params?: { status?: string; page?: number }) {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return this.fetch<PaginatedResponse<Prediction>>(`/predictions?${qs}`);
    }

    async placePrediction(data: { matchId: string; marketId: string; outcomeId: string; amount: number }) {
        return this.fetch<Prediction>('/predictions', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // --- Wallet ---
    async getWallet() {
        return this.fetch<Wallet>('/wallet');
    }

    async getTransactions(params?: { type?: string; page?: number }) {
        const qs = new URLSearchParams(params as Record<string, string>).toString();
        return this.fetch<PaginatedResponse<Transaction>>(`/wallet/transactions?${qs}`);
    }

    async withdraw(data: { currency: string; amount: number; chainId: string; withdrawalType: 'crypto' | 'fiat'; destinationAddress?: string; bankAccountNumber?: string; bankIfsc?: string; bankName?: string }) {
        return this.fetch<Transaction>('/wallet/withdraw', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // --- Referrals ---
    async getReferralStats() {
        return this.fetch<any>('/referrals?view=stats');
    }

    async getReferralNetwork(level = 0) {
        return this.fetch<Referral[]>(`/referrals?view=network&level=${level}`);
    }

    async getReferralRewards() {
        return this.fetch<any[]>(`/referrals?view=rewards`);
    }
    // --- Campaigns & Promotions ---
    async getActivePromotions() {
        return this.fetch<any[]>('/promotions/active');
    }

    async getCampaigns(params?: { status?: string }) {
        const qs = params && params.status ? `?status=${params.status}` : '';
        return this.fetch<any[]>(`/campaigns${qs}`);
    }

    async getCampaignDetail(id: string) {
        return this.fetch<any>(`/campaigns/${id}`);
    }

    async joinCampaign(id: string) {
        return this.fetch<{ message: string; isJoined: boolean }>(`/campaigns/${id}/join`, {
            method: 'POST',
        });
    }
}

export const api = new ApiClient();
