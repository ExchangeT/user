import Pusher from 'pusher-js';
import axios from 'axios';

/**
 * CricChain Pusher Load Tester
 * This script simulates thousands of concurrent users interacting with match chat.
 */

const CONFIG = {
    PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY || '68c741499dc3e659b8be',
    PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'ap2',
    MATCH_ID: 'clv6u8f3a000208l1b1v2x7q9', // Sample Match ID
    USER_COUNT: 500, // Number of concurrent users per script instance
    MESSAGE_RECURRENCE_MS: 5000, // How often users send chat messages
    API_BASE: 'http://localhost:3000'
};

async function simulateUser(id: number) {
    const pusher = new Pusher(CONFIG.PUSHER_KEY, {
        cluster: CONFIG.PUSHER_CLUSTER,
    });

    const channel = pusher.subscribe(`match-${CONFIG.MATCH_ID}`);
    const globalChannel = pusher.subscribe('global-activity');

    let receivedCount = 0;
    let startTime = Date.now();

    channel.bind('new-message', (data: any) => {
        receivedCount++;
        // Latency check if timestamp exists
        if (data.timestamp) {
            const latency = Date.now() - data.timestamp;
            if (receivedCount % 50 === 0) {
                console.log(`[User ${id}] Latency: ${latency}ms | Total Received: ${receivedCount}`);
            }
        }
    });

    // Periodically send a message to simulate active chat
    setInterval(async () => {
        if (Math.random() > 0.8) { // Only 20% of users talk every interval
            try {
                await axios.post(`${CONFIG.API_BASE}/api/chat`, {
                    matchId: CONFIG.MATCH_ID,
                    content: `Load Test Message from Virtual User ${id} - #${receivedCount}`,
                    userName: `V-User-${id}`
                });
            } catch (e) {
                // Silently handle rate limits or API errors during stress test
            }
        }
    }, CONFIG.MESSAGE_RECURRENCE_MS);

    return { pusher, id };
}

async function runTest() {
    console.log(`\n🚀 Starting Load Test with ${CONFIG.USER_COUNT} users...`);
    console.log(`📍 Target: match-${CONFIG.MATCH_ID} and global-activity`);

    const users: any[] = [];
    for (let i = 0; i < CONFIG.USER_COUNT; i++) {
        const user = await simulateUser(i);
        users.push(user);

        if (i % 50 === 0) {
            console.log(`✅ spawned ${i} users...`);
        }

        // Stagger connections to avoid instant surge limits
        await new Promise(r => setTimeout(r, 20));
    }

    console.log(`\n🔥 LOAD TEST ACTIVE. Monitor Pusher dashboard for connection surge.`);

    // Run for 5 minutes
    setTimeout(() => {
        console.log('\n🛑 TEST COMPLETE. Cleaning up connections...');
        users.forEach(u => u.pusher.disconnect());
        process.exit(0);
    }, 300000);
}

runTest().catch(console.error);
