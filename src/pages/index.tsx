import React, { useState } from "react";
import InputBox from "@/components/InputBox";
import ChatBox from "@/components/ChatBox";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const IndexPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const sendMessageToAPI = async (message: string) => {
    const userMessage: Message = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);

    try {
      const apiKey = process.env.NEXT_PUBLIC_VALID_API_KEY;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey || "",
        },
        body: JSON.stringify({
          userMessage: message,
        }),
      });
      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I couldn't process your message." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4 m-8 items-center h-screen">

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#fffcfc] p-6 rounded-lg shadow-lg max-w-md text-center">
            <h2 className="text-lg font-bold mb-4">Welcome to FilmFinder 🎥</h2>
            <p className="text-gray-700 mb-6">
              Welcome to your personal movie assistant! Simply describe yourself and your
              preferences, and I&apos;ll suggest the perfect movie for you. Keep in mind, my knowledge covers movies
              released up until January 2022. If you&apos;d like a recommendation for a newer movie, include the IMDb URL
              at the beginning of your message, and I&apos;ll take it into consideration when suggesting the perfect movie for you!
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-[#28242c] text-white px-4 py-2 rounded-full hover:bg-black"
            >
              Got it!
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-center ">FilmFinder 🎥</h1>
      <ChatBox messages={messages} isLoading={isLoading} />
      <InputBox onSubmit={sendMessageToAPI} isLoading={isLoading} />
    </div>

  );
};

export default IndexPage;

