import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id: matchId } = await params;
        const { message } = await request.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const chatEvent = {
            id: Math.random().toString(36).substring(7),
            userId: (session.user as any).id,
            userName: session.user.name || 'Anonymous',
            userImage: session.user.image,
            message: message.trim(),
            timestamp: new Date().toISOString(),
        };

        // Broadcast to the match-specific chat channel
        await pusherServer.trigger(`chat-${matchId}`, 'new-message', chatEvent);

        return NextResponse.json({ success: true, data: chatEvent });
    } catch (error: any) {
        console.error('[MATCH_CHAT_ERROR]:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
