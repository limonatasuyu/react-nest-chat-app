import { Button, Input, Typography } from "antd";
import { useState } from "react";

export default function HomePage() {
  const [isInputVisible, setInputVisible] = useState(false);
  const [inputStatus, setInputStatus] = useState<"" | "error">("");
  const [inputValue, setInputValue] = useState("");

  function handleSignWithUsername() {
    if (inputValue === "") setInputStatus("error");
  }
  function handleSign() {}

  return (
    <div className="min-h-screen w-screen flex justify-center items-center bg-cover bg-no-repeat bg-[url('/background.png')]">
      <div className="flex flex-col items-center space-y-16 text-center">
        <div className="space-y-6">
          <Typography.Title
            level={1}
            className="text-white bg-gradient-to-br from-gray-500 to-gray-100 py-4 px-12 text-6xl md:text-8xl rounded-lg shadow-lg opacity-90"
          >
            WhisperNet
          </Typography.Title>
          <Typography.Text className="text-white text-2xl md:text-4xl lg:text-5xl bg-gradient-to-bl from-gray-100 to-gray-500 py-3 px-8 rounded-lg shadow-md opacity-90 italic">
            Chat freely, no strings attached
          </Typography.Text>
        </div>

        {isInputVisible ? (
          <div>
            <Input
              className="h-10"
              placeholder="Type a username"
              status={inputStatus}
              onChange={(e) => {
                if (e.target.value !== "" && inputStatus !== "") setInputStatus("")
                setInputValue(e.target.value);
              }}
            />
            <div className="flex gap-2 mt-2">
              <Button
                className="bg-gradient-to-br from-gray-500 to-gray-100 text-white text-[25px] font-bold py-5 px-8 rounded-md shadow-lg hover:scale-105 transform transition-transform duration-30  0"
                type="primary"
                onClick={handleSignWithUsername}
              >
                Continue
              </Button>
              <Button
                className="bg-gradient-to-br from-gray-500 to-gray-100 text-white text-[25px] font-bold py-5 px-8 rounded-md shadow-lg hover:scale-105 transform transition-transform duration-30  0"
                type="primary"
                onClick={handleSign}
              >
                Skip
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="bg-gradient-to-br from-gray-500 to-gray-100 text-white text-[25px] font-bold py-5 px-8 rounded-md shadow-lg hover:scale-105 transform transition-transform duration-300"
            type="primary"
            onClick={() => setInputVisible(true)}
          >
            Start Chatting Now
          </Button>
        )}
      </div>
    </div>
  );
}
