import Editor from "./components/Editor";
import Output from "./components/Output";
import "./App.css";
import { useState } from "react";
import Navigation from "./components/Navigation";

function App() {
  const [output, setOutput] = useState("");
  return (
    <div className="App">
      <Navigation />
      <main>
        <Editor setOutput={setOutput} />
        <Output output={output} />
      </main>
    </div>
  );
}

export default App;
