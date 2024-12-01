import React from "react";
import { WORD_LIMIT } from "@/utils/consts";

interface InputBoxProps {
    onSubmit: (message: string) => void;
    isLoading: boolean;
}

export default function InputBox({ onSubmit, isLoading }: InputBoxProps) {
    const [input, setInput] = React.useState("");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!input.trim()) return;
        const currentInput = input;
        setInput("");
        await onSubmit(currentInput);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSubmit(event);
        }
    };

    return (
        <form className="input-box flex flex-col mt-4" onSubmit={handleSubmit}>
            <div className="flex items-center gap-2">
                <textarea
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 border rounded-lg bg-[#fffcfc] text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#28242c] resize-none"
                    placeholder="Tell me about yourself and your movie vibe, and I’ll do the rest..."
                    maxLength={WORD_LIMIT}
                    rows={3}
                />
                <button
                    type="submit"
                    className={`flex items-center justify-center px-6 py-3 rounded-full transition ${isLoading
                        ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                        : "bg-[#28242c] text-white hover:bg-black"
                        }`}
                    disabled={isLoading}
                    style={{ height: "fit-content" }}
                >
                    {isLoading ? (
                        <div className="loader w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        "Send"
                    )}
                </button>
            </div>
            <div className={`text-sm ${WORD_LIMIT - input.length < 15 ? "text-red-500" : "text-gray-500"} mt-1`}>
                {WORD_LIMIT - input.length} characters remaining
            </div>
        </form>
    );
}
