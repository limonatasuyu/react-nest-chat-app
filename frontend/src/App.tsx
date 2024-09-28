import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import { useState, useEffect } from "react";
import { Typography } from "antd";

function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.hash.slice(1) || "/"
  );

  const [username, setUsername] = useState("");

  useEffect(() => {
    const handleHashChange = () =>
      setCurrentPath(window.location.hash.slice(1) || "/");
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function navigate(path: string) {
    window.location.hash = path;
  }

  return (
    <>
      {currentPath === "/" && (
        <HomePage navigate={navigate} setUsername={setUsername} />
      )}
      {currentPath === "chat" && (
        <ChatPage username={username} setUsername={setUsername} />
      )}
      {currentPath !== "chat" && currentPath !== "/" && (
        <div className="w-screen h-screen flex items-center justify-center">
          <Typography.Title>
            404 Not Found
          </Typography.Title>
        </div>
      )}
    </>
  );
}

export default App;
