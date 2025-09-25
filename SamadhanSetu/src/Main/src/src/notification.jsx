import React from 'react';
import { Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const sampleNotifications = [
    { id: 1, type: 'comment', text: 'Priya Sharma commented on your post: "Great work!"', time: '1h ago', read: false, icon: '💬' },
    { id: 2, type: 'like', text: 'Raj Kumar liked your photo.', time: '3h ago', read: false, icon: '❤️' },
    { id: 3, type: 'report', text: 'Your report "Pothole on Main St" has been updated to "In Progress".', time: '5h ago', read: true, icon: '🚧' },
    { id: 4, type: 'mention', text: 'Anita Desai mentioned you in a comment.', time: '1d ago', read: true, icon: '👤' },
    { id: 5, type: 'system', text: 'Welcome to EcoVoice! Start sharing your green actions.', time: '3d ago', read: true, icon: '🎉' },
];

export default function Notifications() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b">
                    <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Profile"))}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Bell /> Notifications</h1>
                </div>

                <div className="p-4 space-y-3">
                    {sampleNotifications.map(notif => (
                        <Card key={notif.id} className={`transition-all ${!notif.read ? 'bg-green-50 border-green-200' : 'bg-white'}`}>
                            <CardContent className="p-4 flex items-start gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarFallback className="bg-transparent text-xl">{notif.icon}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="text-slate-800">{notif.text}</p>
                                    <p className="text-xs text-slate-500 mt-1">{notif.time}</p>
                                </div>
                                {!notif.read && <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
