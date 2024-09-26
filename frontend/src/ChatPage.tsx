import { Button, Input } from "antd";
import { useEffect, useState } from "react";

const mockChats = [
  {
    id: 0,
    name: "Chat 1",
    lastMessage: {
      author: "User1",
      message: "Hey, how are you?",
    },
  },
  {
    id: 1,
    name: "Chat 2",
    lastMessage: {
      author: "User2",
      message: "Let's meet tomorrow.",
    },
  },
  {
    id: 2,
    name: "Chat 3",
    lastMessage: {
      author: "User3",
      message: "Where are the files?",
    },
  },
];

const mockCurrentChat = {
  id: 0,
  name: "Chat 1",
  items: [
    {
      time: new Date(),
      author: "User1",
      content: "Hello!",
    },
    {
      time: new Date(),
      author: "User2",
      content: "Hi, how's it going?",
    },
  ],
};

function getRandomColor() {
  const colors = ["#F56565", "#ED8936", "#48BB78", "#4299E1", "#9F7AEA"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function ChatPage() {
  const [chats, setChats] = useState(mockChats);
  const [currentChat, setCurrentChat] = useState(mockCurrentChat);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // Open WebSocket connection to the NestJS server
    const ws = new WebSocket("ws://localhost:3001");

    ws.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
      console.log("Message from server:", event.data);
      //setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket server");
    };

    setWebSocket(ws);

    return () => {
     // ws.close(); // Clean up WebSocket connection when component unmounts
    };
  }, []);

  function handleChatSwitch(id: number) {
    if (id === currentChat.id) return;
    return;
  }

  function handleSendMessage() {
    webSocket?.send(inputValue);
  }

  return (
    <div className="bg-gray-100 w-screen h-screen flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl h-full flex shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/3 bg-gray-200 p-4 overflow-auto">
          <h2 className="text-xl font-bold mb-4">Chats</h2>
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`p-3 ${
                currentChat.id === chat.id
                  ? "bg-gray-500"
                  : "bg-white hover:bg-gray-100"
              } rounded-md mb-2 cursor-pointer`}
              onClick={() => handleChatSwitch(chat.id)}
            >
              <div
                className={`font-medium ${
                  currentChat.id === chat.id && "text-white"
                }`}
              >
                {chat.name}
              </div>
              <div
                className={`text-sm truncate text-${
                  currentChat.id === chat.id ? "white" : "gray-600"
                }`}
              >
                {chat.lastMessage.author}: {chat.lastMessage.message}
              </div>
            </div>
          ))}
        </div>
        <div className="w-2/3 flex flex-col">
          <div className="bg-gray-50 p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold">{currentChat.name}</h2>
          </div>
          <div className="flex-1 p-4 overflow-auto bg-white">
            {currentChat.items.map((message, index) => (
              <div key={index} className="mb-4">
                <div className={`font-bold text-[${getRandomColor()}]`}>
                  {message.author}
                </div>
                <div className="text-gray-600">{message.content}</div>
                <div className="text-xs text-gray-500">
                  {message.time.toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-100 border-t border-gray-200">
            <form className="flex gap-2">
              <Input
                className="flex-1"
                placeholder="Type a message..."
                onChange={(e) => setInputValue(e.target.value)}
                value={inputValue}
              />
              <Button
                type="primary"
                disabled={!inputValue.length}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
