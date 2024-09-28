import { FC } from "react";

interface Chat {
  id: string;
  name: string;
  lastMessage?: {
    author: string;
    content: string;
  };
}

interface ChatListProps {
  chats: Chat[];
  currentChat: {
    name: string;
    id: string;
  } | null;
  switchChat: (id: string) => void;
}

const ChatList: FC<ChatListProps> = ({ chats, currentChat, switchChat }) => {
  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`p-3 ${
            currentChat?.id === chat.id
              ? "bg-gray-500"
              : "bg-white hover:bg-gray-100"
          } rounded-md mb-2 cursor-pointer`}
          onClick={() => switchChat(chat.id)}
        >
          <div
            className={`font-medium ${
              currentChat?.id === chat.id && "text-white"
            }`}
          >
            {chat.name}
          </div>
          <div
            className={`text-sm truncate ${
              currentChat?.id === chat.id ? "text-white" : "text-gray-600"
            }`}
          >
            {chat.lastMessage ? (
              <div>
                <span style={{ fontWeight: "bold" }}>
                  {chat.lastMessage?.author}:&nbsp;
                </span>
                {chat.lastMessage?.content}
              </div>
            ) : (
              <div>No new messages.</div>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default ChatList;
