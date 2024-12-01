import React, { useEffect, useRef } from "react";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface ChatBoxProps {
    messages: Message[];
    isLoading: boolean;
}

export default function ChatBox({ messages, isLoading }: ChatBoxProps) {
    const chatBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTo({
                top: chatBoxRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <div
            ref={chatBoxRef}
            className="chat-box h-2/3 overflow-y-auto p-4 border rounded-xl bg-[#FFFFFA] shadow-md"
        >
            {messages.map((message, index) => (
                <div
                    key={index}
                    className={`message m-4 p-2 rounded-xl max-w-5xl w-fit ${message.role === 'user' ?
                        'bg-[#d8d4fc] text-gray-800 self-end ml-auto' : 'bg-[#ffecbc] text-grey-800 self-start mr-auto'
                        }`}
                    style={{ wordBreak: 'break-word' }}
                >
                    <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong> {message.content}
                </div>

            ))}
            {isLoading && (
                <div className="flex justify-center items-center mt-4">
                    <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
        </div>
    );
}
