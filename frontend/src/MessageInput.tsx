import { Button, Input } from "antd";
import { FC } from "react";

interface MessageInputProps {
  username: string;
  messageInput: string;
  setMessageInput: (input: string) => void;
  sendMessage: () => void;
}

const MessageInput: FC<MessageInputProps> = ({ username, messageInput, setMessageInput, sendMessage }) => {
  return (
    <div className="flex">
      <Input.TextArea
        placeholder={`Message as ${username}`}
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        onPressEnter={sendMessage}
        className="flex-1"
        autoSize={{ minRows: 1, maxRows: 5 }}
      />
      <Button type="primary" onClick={sendMessage} disabled={!messageInput} className="ml-2">
        Send
      </Button>
    </div>
  );
};

export default MessageInput;
