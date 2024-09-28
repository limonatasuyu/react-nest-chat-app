import { useEffect, useState, useRef, useCallback } from "react";
import { faker } from "@faker-js/faker";
import ChatList from "./ChatList";
import ChatMessages from "./ChatMessages";
import MessageInput from "./MessageInput";
import GroupJoin from "./GroupJoin";
import { Button, Input, Modal, message } from "antd";
import DiceIcon from "./DiceIcon";
import { CopyOutlined, ShareAltOutlined } from "@ant-design/icons";

// Generate a random room name with an adjective, noun, and number for uniqueness
function generateRandomRoomName() {
  const adjective = faker.word.adjective();
  const noun = faker.word.noun();
  const number = faker.number.int({ min: 1, max: 999 });
  return `${capitalize(adjective)}${capitalize(noun)}${number}`;
}

// Capitalize the first letter of a word
function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Main ChatPage component
export default function ChatPage({
  username,
  setUsername,
}: {
  username: string;
  setUsername: (username: string) => void;
}) {
  const [rooms, setRooms] = useState<
    { id: string; name: string; lastMessage?: { author: string; content: string } }[]
  >([]);
  const [roomMessages, setRoomMessages] = useState<
    { id: string; name: string; messages: { author: string; content: string; time: Date }[] }[]
  >([]);
  const [activeMessages, setActiveMessages] = useState<{ author: string; content: string; time: Date }[]>([]);
  const [activeRoom, setActiveRoom] = useState<{ id: string; name: string } | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [joinGroupLink, setJoinGroupLink] = useState("");
  const [newGroupName, setNewGroupName] = useState("");
  const [isGroupJoined, setIsGroupJoined] = useState(false);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);


  const handleIncomingMessage = useCallback((message: any) => {
    const newMessage = { author: message.author, content: message.content, time: new Date() };

    // If the active room matches the message's room, update the message list
    if (activeRoom?.id === message.groupId) {
      console.log("wghaaa")
      setActiveMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    // Update messages for the relevant room
    setRoomMessages((prevMessages) =>
      prevMessages.map((room) =>
        room.id === message.groupId ? { ...room, messages: [...room.messages, newMessage] } : room
      )
    );

    // Update the last message in the rooms list
    setRooms((prevRooms) =>
      prevRooms.map((room) =>
        room.id === message.groupId
          ? { ...room, lastMessage: { author: message.author, content: message.content } }
          : room
      )
    );
  }, [activeRoom?.id])

  useEffect(() => {
    socketRef.current = new WebSocket("wss://react-nest-chat-app-production.up.railway.app/");

    socketRef.current.onopen = () => {
      console.log("Connected to WebSocket");
      const user = username || faker.internet.userName();
      setUsername(user);
      sendSocketEvent("set_username", user);
    };

    socketRef.current.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      console.log("Received from server:", receivedData);

      switch (receivedData.type ?? event.type) {
        case "message":
          handleIncomingMessage(receivedData);
          break;
        case "create_group":
        case "join_group":
          handleGroupUpdate(receivedData);
          break;
        case "group_not_found":
          message.error("Couldn't found the room");
          break;
        default:
          console.warn("Unknown event type:", event.type);
          message.error("Unknown error occured.");
      }
    };

    socketRef.current.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [username, handleIncomingMessage, setUsername]);

  // Send data through WebSocket
  function sendSocketEvent(event: string, data: any) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, data }));
    } else {
      console.log("WebSocket is not open");
    }
  }

  function handleGroupUpdate(group: any) {
    setIsGroupJoined(true);
    setActiveRoom({ id: group.groupId, name: group.groupName });

    setActiveMessages([]);
    setRooms((prevRooms) => [...prevRooms, { id: group.groupId, name: group.groupName }]);
    setRoomMessages((prevMessages) => [
      ...prevMessages,
      { id: group.groupId, name: group.groupName, messages: [] },
    ]);
  }

  function switchRoom(id: string) {
    if (id === activeRoom?.id) return;

    const selectedRoom = rooms.find((room) => room.id === id) || null;
    setActiveRoom(selectedRoom);

    const messagesForRoom = roomMessages.find((room) => room.id === id)?.messages || [];
    setActiveMessages(messagesForRoom);
  }

  function sendMessage() {
    if (messageInput.trim() === "" || !activeRoom) return;

    sendSocketEvent("message", { content: messageInput, groupId: activeRoom.id });
    setMessageInput("");
  }

  function createRoom() {
    if (newGroupName.trim() === "") return;
    sendSocketEvent("create_group", newGroupName);
    setIsGroupJoined(true);
    setNewGroupName("");
  }

  function handleJoinGroup() {
    sendSocketEvent("join_group", joinGroupLink);
    setJoinGroupLink("");
  }

  return (
    <div className="bg-gray-100 w-screen h-screen flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-5xl h-full flex shadow-lg rounded-lg overflow-hidden">
        {!isGroupJoined ? (
          <GroupJoin
            isCreatingNewRoom={isCreatingRoom}
            groupLink={joinGroupLink}
            setGroupLink={setJoinGroupLink}
            groupName={newGroupName}
            setGroupName={setNewGroupName}
            setIsCreatingNewRoom={setIsCreatingRoom}
            handleCreateGroup={createRoom}
            handleJoinGroup={handleJoinGroup}
          />
        ) : (
          <>
            <div className="w-1/3 bg-gray-200 p-4 overflow-auto">
              <div className="flex justify-between">
                <h2 className="text-xl font-bold mb-4">Rooms</h2>
                <div className="flex gap-2">
                  <JoinRoomModal groupLink={joinGroupLink} setGroupLink={setJoinGroupLink} handleJoinGroup={handleJoinGroup} />
                  <CreateRoomModal
                    groupName={newGroupName}
                    setGroupName={setNewGroupName}
                    handleCreateGroup={createRoom}
                  />
                </div>
              </div>
              <ChatList chats={rooms} currentChat={activeRoom} switchChat={switchRoom} />
            </div>
            <div className="w-2/3 flex flex-col">
              <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between w-full">
                <h2 className="text-xl font-semibold">{activeRoom?.name}</h2>
                <ShareRoomModal groupId={activeRoom?.id} />
              </div>
              <div className="flex-1 p-4 overflow-auto bg-white">
                <ChatMessages chatMessages={activeMessages} />
              </div>
              <div className="p-4 bg-gray-100 border-t border-gray-200">
                <MessageInput
                  username={username}
                  messageInput={messageInput}
                  setMessageInput={setMessageInput}
                  sendMessage={sendMessage}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function CreateRoomModal({
  groupName,
  setGroupName,
  handleCreateGroup,
}: {
  groupName: string;
  setGroupName: (name: string) => void;
  handleCreateGroup: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create New
      </Button>
      <Modal
        title="Create Room"
        open={open}
        okText="Create"
        onCancel={() => setOpen(false)}
        onOk={() => {
          handleCreateGroup();
          setOpen(false);
        }}
      >
        <div className="flex justify-center w-full my-12">
          <Input
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="mb-2 w-80"
            suffix={<DiceIcon onClick={() => setGroupName(generateRandomRoomName())} />}
          />
        </div>
      </Modal>
    </>
  );
}

function JoinRoomModal({
  groupLink,
  setGroupLink,
  handleJoinGroup,
}: {
  groupLink: string;
  setGroupLink: (link: string) => void;
  handleJoinGroup: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Join New
      </Button>
      <Modal
        title="Join to Room"
        open={open}
        okText="Join"
        onCancel={() => setOpen(false)}
        onOk={() => {
          handleJoinGroup();
          setOpen(false);
        }}
      >
        <div className="flex justify-center w-full my-12">
          <Input
            placeholder="Group Name"
            value={groupLink}
            onChange={(e) => setGroupLink(e.target.value)}
            className="mb-2 w-80"
          />
        </div>
      </Modal>
    </>
  );
}

function ShareRoomModal({ groupId }: { groupId?: string }) {
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(groupId ?? "");
      message.success("Copied to clipboard!");
    } catch (err) {
      message.error("Failed to copy!");
    }
  };

  return (
    <>
      <ShareAltOutlined onClick={() => setOpen(true)} />{" "}
      <Modal
        title="Copy room id"
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <div className="flex justify-center w-full my-12">
          <Input
            placeholder="Group Name"
            value={groupId}
            className="mb-2 w-80"
            suffix={<CopyOutlined onClick={handleCopy} />}
          />
        </div>
      </Modal>
    </>
  );
}
