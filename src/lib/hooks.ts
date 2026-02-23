import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api-client';
import { toast } from '@/components/ui/Toast';

// --- Auth & User ---
export function useCurrentUser() {
    return useQuery({
        queryKey: ['user', 'me'],
        queryFn: () => api.getMe(),
    });
}

// --- Matches ---
export function useMatches(params?: { status?: string; search?: string; page?: number }) {
    return useQuery({
        queryKey: ['matches', params],
        queryFn: () => api.getMatches(params),
    });
}

export function useMatchDetail(id: string) {
    return useQuery({
        queryKey: ['matches', id],
        queryFn: () => api.getMatchDetail(id),
        enabled: !!id,
    });
}

// --- Markets ---
export function useMarkets(matchId: string) {
    return useQuery({
        queryKey: ['markets', matchId],
        queryFn: () => api.getMarkets(matchId),
        enabled: !!matchId,
    });
}

// --- Predictions ---
export function useMyPredictions(params?: { status?: string; page?: number }) {
    return useQuery({
        queryKey: ['predictions', 'me', params],
        queryFn: () => api.getMyPredictions(params),
    });
}

export function usePlacePrediction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { matchId: string; marketId: string; outcomeId: string; amount: number }) =>
            api.placePrediction(data),
        onSuccess: (_, variables) => {
            toast('Prediction placed successfully!', 'success');
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['predictions', 'me'] });
            queryClient.invalidateQueries({ queryKey: ['matches', variables.matchId] });
            queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
        },
        onError: (err: any) => {
            toast(err.message || 'Failed to place prediction', 'error');
        },
    });
}

// --- Wallet ---
export function useWallet() {
    return useQuery({
        queryKey: ['wallet'],
        queryFn: () => api.getWallet(),
    });
}

export function useTransactions(params?: { type?: string; page?: number }) {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => api.getTransactions(params),
    });
}

export function useWithdraw() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Parameters<typeof api.withdraw>[0]) => api.withdraw(data),
        onSuccess: () => {
            toast('Withdrawal initiated successfully', 'success');
            queryClient.invalidateQueries({ queryKey: ['wallet'] });
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
        onError: (err: any) => {
            toast(err.message || 'Withdrawal failed', 'error');
        },
    });
}

// --- Referrals ---
export function useReferralStats() {
    return useQuery({
        queryKey: ['referrals', 'stats'],
        queryFn: () => api.getReferralStats(),
    });
}

export function useReferralNetwork(level = 0) {
    return useQuery({
        queryKey: ['referrals', 'network', level],
        queryFn: () => api.getReferralNetwork(level),
    });
}

export function useReferralRewards() {
    return useQuery({
        queryKey: ['referrals', 'rewards'],
        queryFn: () => api.getReferralRewards(),
    });
}

// --- Campaigns & Promotions ---
export function useActivePromotions() {
    return useQuery({
        queryKey: ['promotions', 'active'],
        queryFn: () => api.getActivePromotions(),
    });
}

export function useCampaigns(status?: string) {
    return useQuery({
        queryKey: ['campaigns', status],
        queryFn: () => api.getCampaigns({ status }),
    });
}

export function useCampaignDetail(id: string) {
    return useQuery({
        queryKey: ['campaign', id],
        queryFn: () => api.getCampaignDetail(id),
        enabled: !!id,
    });
}

export function useJoinCampaign() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (campaignId: string) => api.joinCampaign(campaignId),
        onSuccess: (data, variables) => {
            toast(data.message || 'Successfully joined!', 'success');
            queryClient.invalidateQueries({ queryKey: ['campaign', variables] });
        },
        onError: (err: any) => {
            toast(err.message || 'Failed to join campaign', 'error');
        },
    });
}
