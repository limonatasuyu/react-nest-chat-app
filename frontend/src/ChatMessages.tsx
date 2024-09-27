import { FC, Fragment } from "react";

interface ChatMessage {
  time: Date;
  author: string;
  content: string;
}

interface ChatMessagesProps {
  chatMessages: ChatMessage[];
}

function removeExtraLineBreaks(arr: string[]) {
  const cleanedArray = arr.filter((line, index) => line !== "" || arr[index - 1] !== "");

  while (cleanedArray[cleanedArray.length - 1] === "") {
    cleanedArray.pop();
  }

  return cleanedArray;
}

const ChatMessages: FC<ChatMessagesProps> = ({ chatMessages }) => {
  return (
    <>
      {chatMessages.map((message, index) => (
        <div key={index} className="mb-4 border rounded-lg p-2">
          <div className={`font-bold text-${message.author}`}>{message.author}</div>
          <div className="text-gray-600">
            {removeExtraLineBreaks(message.content.split("\n")).map((line, key) => (
              <Fragment key={key}>
                <div>{line}</div>
                {line === "" && <br />}
              </Fragment>
            ))}
          </div>
          <div className="text-xs text-gray-500">{message.time.toLocaleTimeString()}</div>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
