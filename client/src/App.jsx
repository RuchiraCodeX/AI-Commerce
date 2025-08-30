import { useState, useEffect } from "react";   // ✅ include useEffect
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/")
      .then((res) => res.text())
      .then((data) => console.log(data));
  }, []);

  return (
    <>
      <h1>AI-Commerce Client</h1>
      <p>Check the browser console for backend response 🚀</p>
    </>
  );
}

export default App;
