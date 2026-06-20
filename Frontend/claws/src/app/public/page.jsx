'use client';

import { useRef, useState } from 'react';

const createSessionId = () => 'chat-' + Date.now();

export default function PublicPage() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [sessionId, setSessionId] = useState(createSessionId);

  const inputBox = useRef(null);

  const sendMessage = async () => {
    const cleanMessage = message.trim();

    if (cleanMessage === '' || isSending) return;

    const userMessage = {
      sender: 'You',
      text: cleanMessage,
    };

    setChatMessages((oldMessages) => [...oldMessages, userMessage]);
    setMessage('');
    setIsSending(true);

    try {
      const response = await fetch('http://localhost:5020/web/chatbot/chat-away', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: cleanMessage,
          sessionId: sessionId,
        }),
      });

      const data = await response.json();

      const clawMessage = {
        sender: 'Sunny Claws',
        text: data.reply || 'I could not create a reply.',
      };

      setChatMessages((oldMessages) => [...oldMessages, clawMessage]);
    } catch (error) {
      setChatMessages((oldMessages) => [
        ...oldMessages,
        {
          sender: 'Sunny Claws',
          text: 'The backend is not reachable right now.',
        },
      ]);
    } finally {
      setIsSending(false);
      inputBox.current?.focus();
    }
  };

  const startNewChat = () => {
    setChatMessages([]);
    setMessage('');
    setSessionId(createSessionId());
    inputBox.current?.focus();
  };

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      <aside className="flex w-64 flex-col bg-zinc-950 p-4 text-white">
        <h1 className="mb-4 text-2xl font-bold">🐾 Sunny Claws</h1>

        <button
          onClick={startNewChat}
          className="rounded-lg bg-zinc-800 p-3 text-left hover:bg-zinc-700"
        >
          + New Chat
        </button>

        <div className="mt-6 rounded-lg bg-zinc-900 p-3 text-sm text-zinc-400">
          Memory: MongoDB
        </div>

        <div className="mt-auto text-xs text-zinc-500">
          OpenClaw replica project
        </div>
      </aside>

      <main className="flex flex-1 flex-col">
        <header className="border-b bg-white p-4">
          <h2 className="text-xl font-semibold">OpenClaw Assistant</h2>
          <p className="text-sm text-zinc-500">
            Simple chat interface with backend memory.
          </p>
        </header>

        <section className="flex-1 space-y-4 overflow-y-auto p-6">
          {chatMessages.length === 0 && (
            <div className="mt-24 text-center">
              <div className="text-6xl">🐾</div>

              <h2 className="mt-4 text-3xl font-bold">
                What should we build today?
              </h2>

              <p className="mt-2 text-zinc-500">
                Type a message and Sunny Claws will reply.
              </p>
            </div>
          )}

          {chatMessages.map((chat, index) => {
            const isUser = chat.sender === 'You';

            return (
              <div
                key={index}
                className={
                  isUser
                    ? 'ml-auto max-w-2xl rounded-2xl bg-blue-600 p-4 text-white'
                    : 'mr-auto max-w-2xl rounded-2xl bg-white p-4 shadow'
                }
              >
                <p className="mb-1 text-sm font-bold">{chat.sender}</p>
                <p className="whitespace-pre-wrap">{chat.text}</p>
              </div>
            );
          })}

          {isSending && (
            <div className="mr-auto max-w-2xl rounded-2xl bg-white p-4 shadow">
              <p className="mb-1 text-sm font-bold">Sunny Claws</p>
              <p className="animate-pulse">Thinking...</p>
            </div>
          )}
        </section>

        <footer className="border-t bg-white p-4">
          <div className="mx-auto flex max-w-4xl gap-3">
            <input
              ref={inputBox}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSending}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Message Sunny Claws..."
              className="flex-1 rounded-xl border p-4 outline-none focus:border-blue-500"
            />

            <button
              onClick={sendMessage}
              disabled={isSending}
              className="rounded-xl bg-blue-600 px-6 py-4 font-bold text-white disabled:bg-zinc-400"
            >
              Send
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}