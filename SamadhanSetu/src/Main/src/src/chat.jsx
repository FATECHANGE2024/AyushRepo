import React, { useState } from 'react';
import { ArrowLeft, Search, Send, MoreVertical, Phone, Video } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

const conversations = [
    { id: 1, name: 'Priya Sharma', avatar: null, lastMessage: 'Great, see you then!', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Raj Kumar', avatar: null, lastMessage: 'Can you send me the report?', time: '9:45 AM', unread: 0 },
    { id: 3, name: 'Anita Desai', avatar: null, lastMessage: 'Thanks for the composting tips!', time: 'Yesterday', unread: 0 },
    { id: 4, name: 'Sameer Verma', avatar: null, lastMessage: 'The rainwater system is working great.', time: 'Yesterday', unread: 1 },
    { id: 5, name: 'EcoWarriors Group', avatar: null, lastMessage: 'Priya: Let\'s schedule the next cleanup.', time: '2 days ago', unread: 0, isGroup: true },
];

const messages = {
    1: [
        { sender: 'Priya Sharma', text: 'Hey! Are we still on for the park cleanup on Sunday?', time: '10:28 AM' },
        { sender: 'me', text: 'Yes, definitely! I\'ll be there.', time: '10:29 AM' },
        { sender: 'Priya Sharma', text: 'Great, see you then!', time: '10:30 AM' },
    ],
    2: [
        { sender: 'Raj Kumar', text: 'Can you send me the report?', time: '9:45 AM' },
    ],
};

export default function Chat() {
    const navigate = useNavigate();
    const [selectedConversationId, setSelectedConversationId] = useState(1);
    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    const ConversationItem = ({ conv, isSelected, onClick }) => (
        <div
            onClick={onClick}
            className={`flex items-center p-3 cursor-pointer rounded-lg ${isSelected ? 'bg-green-100' : 'hover:bg-slate-50'}`}
        >
            <Avatar className="w-12 h-12 mr-3">
                <AvatarFallback className="bg-gray-200">{conv.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex justify-between">
                    <h3 className="font-semibold">{conv.name}</h3>
                    <p className="text-xs text-gray-500">{conv.time}</p>
                </div>
                <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                    {conv.unread > 0 && (
                        <div className="w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                            {conv.unread}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="h-screen flex bg-white font-sans">
            {/* Sidebar with conversations */}
            <div className={`w-full md:w-1/3 lg:w-1/4 border-r border-slate-200 flex flex-col ${selectedConversationId && 'hidden md:flex'}`}>
                <div className="p-4 border-b border-slate-200">
                     <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="icon" onClick={() => navigate(createPageUrl("EcoVoice"))} className="md:hidden">
                            <ArrowLeft />
                        </Button>
                        <h2 className="text-2xl font-bold">Chats</h2>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input placeholder="Search chats" className="pl-10 bg-slate-100 border-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {conversations.map(conv => (
                        <ConversationItem
                            key={conv.id}
                            conv={conv}
                            isSelected={selectedConversationId === conv.id}
                            onClick={() => setSelectedConversationId(conv.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 flex-col ${!selectedConversationId ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                    <>
                        <div className="flex items-center justify-between p-3 border-b border-slate-200">
                             <div className="flex items-center">
                                <Button variant="ghost" size="icon" onClick={() => setSelectedConversationId(null)} className="md:hidden mr-2">
                                    <ArrowLeft />
                                </Button>
                                <Avatar className="w-10 h-10 mr-3">
                                    <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{selectedConversation.name}</h3>
                                    <p className="text-xs text-green-500">Online</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="icon"><Video /></Button>
                                <Button variant="ghost" size="icon"><Phone /></Button>
                                <Button variant="ghost" size="icon"><MoreVertical /></Button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
                            {(messages[selectedConversation.id] || []).map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs lg:max-w-md p-3 rounded-lg ${msg.sender === 'me' ? 'bg-green-500 text-white' : 'bg-white shadow-sm'}`}>
                                        <p>{msg.text}</p>
                                        <p className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'} text-right`}>{msg.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-white border-t border-slate-200">
                            <div className="relative">
                                <Input placeholder="Type a message..." className="pr-12 bg-slate-100 border-none rounded-full py-6" />
                                <Button size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-green-500 hover:bg-green-600">
                                    <Send className="w-5 h-5"/>
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-center text-gray-500">
                        <div>
                            <Send size={48} className="mx-auto mb-4" />
                            <h2 className="text-xl font-medium">Select a chat to start messaging</h2>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
