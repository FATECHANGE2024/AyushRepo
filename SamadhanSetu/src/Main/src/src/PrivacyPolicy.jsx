import React from 'react';
import { ArrowLeft, BookLock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PrivacyPolicy() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-slate-50">
            <div className="max-w-2xl mx-auto">
                <div className="p-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b">
                    <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("Profile"))}>
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2"><BookLock /> Privacy Policy</h1>
                </div>

                <div className="p-4 prose lg:prose-xl">
                    <h2>Our Commitment to Your Privacy</h2>
                    <p>This Privacy Policy describes how your personal information is collected, used, and shared when you use our application.</p>
                    
                    <h3>Personal Information We Collect</h3>
                    <p>When you use the app, we automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device. Additionally, as you browse the app, we collect information about the individual web pages or products that you view, what websites or search terms referred you to the app, and information about how you interact with the app.</p>
                    
                    <h3>How Do We Use Your Personal Information?</h3>
                    <p>We use the information we collect generally to fulfill any services provided through the app. Additionally, we use this information to:
                        <ul>
                            <li>Communicate with you;</li>
                            <li>Screen our orders for potential risk or fraud; and</li>
                            <li>When in line with the preferences you have shared with us, provide you with information or advertising relating to our products or services.</li>
                        </ul>
                    </p>
                    
                    <h3>Sharing Your Personal Information</h3>
                    <p>We share your Personal Information with third parties to help us use your Personal Information, as described above. We also use Google Analytics to help us understand how our customers use the app.</p>
                    
                    <h3>Your Rights</h3>
                    <p>If you are a European resident, you have the right to access personal information we hold about you and to ask that your personal information be corrected, updated, or deleted.</p>
                </div>
            </div>
        </div>
    );
}
