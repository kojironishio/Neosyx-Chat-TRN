'use client';

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import socket from "@/lib/socket";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";

export default function Page() {
  const room = 'general';
  const { user } = useAuth();
  const { selectedUser } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const getMessages = async () => {
    try {
      const response = await fetch('http://localhost:8888/api/auth/getMessages');
      if (!response.ok) {
        throw new Error('Erro ao buscar usuários');
      }

      const data = await response.json();

      const formattedMessages = data.map((row: any) => ({
        to: { id: row.to_user_id, name: row.to_user_name },
        sender: { id: row.from_user_id, name: row.from_user_name },
        content: row.message
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    }
  };

  useEffect(() => {
    getMessages();

    if (!selectedUser || !user) return;

    socket.emit("join-room", selectedUser.id);
    socket.emit("join-room", user.id);
    console.log("Usuário conectado ao socket:", user);

    socket.on("message", (msg) => {
      console.log("Mensagem recebida:", msg);
      setMessages((prev) => [...prev, msg]);
      getMessages();
    });

    return () => {
      socket.off("message");
    };
  }, [selectedUser, user]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!messageContent.trim()) return;

    let newMessage: Message = {
      to: selectedUser as User,
      sender: user as User,
      content: messageContent,
    };

    try {
      const response = await fetch('http://localhost:8888/api/auth/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar a mensagem');
      }

      socket.emit("message", { to: selectedUser, message: newMessage });
      setMessageContent("");

      setMessages((prev) => [...prev, newMessage]);
      getMessages();
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  const filteredMessages = messages.filter((message) => 
    (message?.to?.id === user?.id && message?.sender?.id === selectedUser?.id) || 
    (message?.to?.id === selectedUser?.id && message?.sender?.id === user?.id)
  );

  return (
    selectedUser && (
      <main className="flex flex-col justify-between bg-[#f7f7f7] min-h-96 h-full w-full flex-1 p-4">
        <div className="flex flex-col w-full space-y-4 overflow-y-scroll max-h-[75vh] bg-white p-3 rounded-lg shadow-md">
          {filteredMessages.map((message, index) => {
            const showName = index === 0 || message.to?.id !== filteredMessages[index - 1].to?.id;

            return (
              <div key={index} className={`flex ${message.sender?.id === user?.id ? "justify-end" : "justify-start"} gap-2`}>
                <div className={`flex items-start ${message.sender?.id === user?.id ? "bg-[#008069]" : "bg-[#dcdcdc]"} p-3 rounded-xl shadow-md max-w-[75%]`}>
                  {showName && (
                    <span className={`text-xs font-semibold ${message.sender?.id === user?.id ? "text-white" : "text-gray-700"} mr-2`}>
                      {message.sender.name}
                    </span>
                  )}
                  <p className="text-sm text-white">{message.content}</p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex items-center gap-2 mt-3">
          <input
            className="w-full p-3 text-black bg-gray-200 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#008069]"
            type="text"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            onKeyUp={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-[#008069] text-white rounded-xl hover:bg-[#006a56]"
          >
            Enviar
          </button>
        </div>
      </main>
    )
  );
}
