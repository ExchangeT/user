/**
 * ML Client Utility
 * Handles communication with the Python FastAPI microservice running on port 8000.
 */

const ML_SERVER_URL = process.env.NEXT_PUBLIC_ML_URL || 'http://127.0.0.1:8000';

export interface MatchPredictionRequest {
    team1: string;
    team2: string;
    venue?: string;
    toss_winner?: string;
    toss_decision?: string;
}

export interface MatchPredictionResponse {
    team1_prob: number;
    team2_prob: number;
    team1_odds: number;
    team2_odds: number;
}

export async function getAIOddsForMatch(context: MatchPredictionRequest): Promise<MatchPredictionResponse | null> {
    try {
        const response = await fetch(`${ML_SERVER_URL}/predict/match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(context),
            // Short timeout so the Next.js API doesn't hang if the python server is down
            signal: AbortSignal.timeout(3000)
        });

        if (!response.ok) {
            console.error('[ML_CLIENT] Non-200 response from ML server:', response.status);
            return null;
        }

        const data: MatchPredictionResponse = await response.json();
        return data;

    } catch (error) {
        console.warn('[ML_CLIENT] Could not reach ML prediction service. Falling back to default odds.', error);
        return null;
    }
}
