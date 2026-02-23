'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, Badge, Button, Tabs } from '@/components/ui';
import { notifications } from '@/lib/mock-data';
import { formatRelativeTime } from '@/lib/utils';
import { CheckCheck, Trash2, Bell, BellOff } from 'lucide-react';

export default function NotificationsPage() {
    const [activeTab, setActiveTab] = useState('all');
    const [notifs, setNotifs] = useState(notifications);

    const unreadCount = notifs.filter(n => !n.isRead).length;

    const filtered = notifs.filter((n) => {
        if (activeTab === 'unread') return !n.isRead;
        if (activeTab === 'prediction') return n.type === 'prediction';
        if (activeTab === 'wallet') return n.type === 'wallet';
        if (activeTab === 'social') return n.type === 'social';
        if (activeTab === 'system') return n.type === 'system' || n.type === 'campaign';
        return true;
    });

    const markAllRead = () => {
        setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const markAsRead = (id: string) => {
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const clearAll = () => {
        setNotifs([]);
    };

    const tabs = [
        { id: 'all', label: 'All', count: notifs.length },
        { id: 'unread', label: 'Unread', count: unreadCount },
        { id: 'prediction', label: 'Predictions', count: notifs.filter(n => n.type === 'prediction').length },
        { id: 'wallet', label: 'Wallet', count: notifs.filter(n => n.type === 'wallet').length },
        { id: 'social', label: 'Social', count: notifs.filter(n => n.type === 'social').length },
        { id: 'system', label: 'System', count: notifs.filter(n => n.type === 'system' || n.type === 'campaign').length },
    ];

    const getTypeBadge = (type: string) => {
        const map: Record<string, { variant: 'gold' | 'green' | 'red' | 'blue' | 'purple'; label: string }> = {
            prediction: { variant: 'gold', label: 'Prediction' },
            wallet: { variant: 'green', label: 'Wallet' },
            social: { variant: 'blue', label: 'Social' },
            system: { variant: 'purple', label: 'System' },
            campaign: { variant: 'red', label: 'Campaign' },
        };
        return map[type] || { variant: 'gold' as const, label: type };
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">🔔 Notifications</h1>
                    <p className="text-[#94a3b8]">
                        {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
                        <CheckCheck className="w-4 h-4" /> Mark All Read
                    </Button>
                    <Button variant="ghost" size="sm" onClick={clearAll} disabled={notifs.length === 0}>
                        <Trash2 className="w-4 h-4" /> Clear All
                    </Button>
                </div>
            </div>

            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            <Card>
                <div className="divide-y divide-white/[0.06]">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 rounded-full bg-[#243049] flex items-center justify-center text-3xl mb-4">
                                {notifs.length === 0 ? <BellOff className="w-8 h-8 text-[#64748b]" /> : <Bell className="w-8 h-8 text-[#64748b]" />}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">
                                {notifs.length === 0 ? 'No notifications' : 'No notifications in this category'}
                            </h3>
                            <p className="text-[#64748b] max-w-sm">
                                {notifs.length === 0 ? 'You\'ve cleared all your notifications.' : 'Try selecting a different filter.'}
                            </p>
                        </div>
                    ) : (
                        filtered.map((notif) => {
                            const badge = getTypeBadge(notif.type);
                            return (
                                <div
                                    key={notif.id}
                                    onClick={() => markAsRead(notif.id)}
                                    className={`flex items-start gap-4 p-5 cursor-pointer transition-colors hover:bg-white/[0.02] ${!notif.isRead ? 'bg-[#f4c430]/[0.02]' : ''
                                        }`}
                                >
                                    {/* Unread Indicator */}
                                    <div className="flex-shrink-0 mt-1">
                                        {!notif.isRead ? (
                                            <div className="w-2.5 h-2.5 bg-[#f4c430] rounded-full" />
                                        ) : (
                                            <div className="w-2.5 h-2.5" />
                                        )}
                                    </div>
                                    {/* Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center text-xl flex-shrink-0">
                                        {notif.icon}
                                    </div>
                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`font-medium ${!notif.isRead ? 'text-white' : 'text-[#94a3b8]'}`}>
                                                    {notif.title}
                                                </p>
                                                <p className="text-sm text-[#64748b] mt-0.5">{notif.description}</p>
                                            </div>
                                            <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                                <Badge variant={badge.variant}>{badge.label}</Badge>
                                                <span className="text-xs text-[#64748b]">{formatRelativeTime(notif.createdAt)}</span>
                                            </div>
                                        </div>
                                        {notif.actionUrl && (
                                            <Link
                                                href={notif.actionUrl}
                                                className="inline-block text-xs text-[#f4c430] hover:underline mt-2"
                                            >
                                                View Details →
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </Card>
        </div>
    );
}
