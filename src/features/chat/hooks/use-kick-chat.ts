import { useEffect, useState, useRef } from "react";

export interface ChatMessage {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  badge?: string;
}

export function useKickChat(channelId?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prevChannelId, setPrevChannelId] = useState<string | undefined>(channelId);
  const [status, setStatus] = useState<"connecting" | "connected" | "disconnected">(
    channelId ? "connecting" : "disconnected"
  );
  const socketRef = useRef<WebSocket | null>(null);

  if (channelId !== prevChannelId) {
    setPrevChannelId(channelId);
    setStatus(channelId ? "connecting" : "disconnected");
  }

  useEffect(() => {
    if (!channelId) return;

    const KICK_PUP_URL = `wss://connection.kick.com/app/sendbird?channel=${channelId}`;
    const socket = new WebSocket(KICK_PUP_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      setStatus("connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "chat_message") {
          const newMessage: ChatMessage = {
            id: data.msg_id || Math.random().toString(),
            sender: data.sender_name || "Izleyici",
            content: data.message || "",
            timestamp: new Date().toLocaleTimeString("tr-TR"),
            badge: data.badge_url || undefined,
          };
          setMessages((prev) => [...prev.slice(-99), newMessage]);
        }
      } catch (err) {
        console.error("Failed to parse chat message", err);
      }
    };

    socket.onclose = () => {
      setStatus("disconnected");
    };

    socket.onerror = () => {
      setStatus("disconnected");
    };

    return () => {
      socket.close();
    };
  }, [channelId]);

  const sendMessage = (content: string) => {
    if (!socketRef.current || status !== "connected" || !content.trim()) return;

    const payload = JSON.stringify({
      event: "send_message",
      data: { message: content },
    });

    socketRef.current.send(payload);
  };

  return { messages, status, sendMessage };
}
