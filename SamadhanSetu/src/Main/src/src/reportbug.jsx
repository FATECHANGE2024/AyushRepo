import React, { useState } from 'react';
import { ArrowLeft, ShieldAlert, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function ReportBug() {
    const navigate = useNavigate();
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b">
                    <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Profile"))}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ShieldAlert /> Report an Issue</h1>
                </div>

                <div className="p-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Something isn't working?</CardTitle>
                            <CardDescription>Let us know what went wrong. Your feedback helps us improve.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {submitted ? (
                                <div className="text-center py-8">
                                    <h3 className="text-xl font-semibold text-green-600">Thank You!</h3>
                                    <p className="text-slate-600 mt-2">Your report has been submitted. Our team will look into it.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="e.g., Unable to upload photo" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="description">Description</Label>
                                        <Textarea id="description" placeholder="Please describe the issue in detail..." required />
                                    </div>
                                    <Button type="submit" className="w-full"><Send className="w-4 h-4 mr-2" /> Submit Report</Button>
                                </form>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
