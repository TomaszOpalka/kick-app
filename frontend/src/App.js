import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [bwList, setBwList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/bw")
      .then((res) => res.json())
      .then(setBwList);

    socket.on("new-bw", (data) => setBwList((prev) => [...prev, data]));
    socket.on("reset", () => setBwList([]));

    return () => {
      socket.off("new-bw");
      socket.off("reset");
    };
  }, []);

  const handleReset = () => {
    fetch("http://localhost:3001/reset", { method: "POST" });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Typy z czatu Kick</h1>
      <button onClick={handleReset}>Reset (Admin)</button>
      <ul>
        {bwList.map(({ user, value }, i) => (
          <li key={i}>
            <strong>{user}</strong>: {value}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
