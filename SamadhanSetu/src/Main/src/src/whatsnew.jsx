import React from 'react';
import { ArrowLeft, Sparkles, Zap, MessageSquare, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';

const updates = [
    { date: 'September 20, 2025', title: 'Chat & Stories Live!', description: 'Connect with fellow eco-warriors with our new Chat feature and share your moments with Stories.', icon: Zap, version: '2.0' },
    { date: 'September 15, 2025', title: 'Donation Platform Launched', description: 'You can now support causes, disaster relief, and nature heroes directly through the app.', icon: Heart, version: '1.5' },
    { date: 'September 10, 2025', title: 'EcoVoice is Here!', description: 'A dedicated social feed to share and celebrate positive environmental actions.', icon: MessageSquare, version: '1.2' },
];

export default function WhatsNew() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b">
                    <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Profile"))}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Sparkles /> What's New</h1>
                </div>

                <div className="p-4">
                    <div className="space-y-6">
                        {updates.map(update => {
                            const Icon = update.icon;
                            return (
                                <div key={update.date} className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1 w-px bg-slate-300 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <p className="text-sm text-slate-500">{update.date}</p>
                                        <h3 className="text-lg font-semibold text-slate-900">{update.title}</h3>
                                        <p className="text-slate-600">{update.description}</p>
                                        <Badge variant="outline" className="mt-2">v{update.version}</Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
