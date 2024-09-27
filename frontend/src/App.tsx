import HomePage from "./HomePage";
import ChatPage from "./ChatPage";
import { useState } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [page, setPage] = useState('');

  function navigate(pageName: '' | 'chat') {
    setPage(pageName);
    window.history.pushState(null, "", `/${pageName}`);
  };

  return (
    <>
      {page === "" && <HomePage navigate={navigate} setUsername={setUsername} />}
      {page === "chat" && <ChatPage username={username} setUsername={setUsername} />}
    </>
  );
}

export default App;
