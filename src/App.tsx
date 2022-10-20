import React, { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
import { listen } from "@tauri-apps/api/event";

interface Message {
  timestamp: string;
  message: string;
}

function App() {
  const [outputs, setOutputs] = useState([] as unknown as Message[]);
  const [inputs, setInputs] = useState([] as unknown as Message[]);
  const [output, setOutput] = useState("");

  const sendOutput = () => {
    console.log("js: js2rs: " + output);
    setOutputs((outputs) => [
      ...outputs,
      {
        timestamp: Date.now(),
        message: output,
      } as unknown as Message,
    ]);
    invoke("js2rs", { message: output });
  };

  const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOutput(e.target.value);
    console.log(e.target.value);
  };

  const listener = async () => {
    await listen("rs2js", (event) => {
      console.log("js: rs2js: ", event);
      setInputs((inputs) => [
        ...inputs,
        { timestamp: Date.now(), message: event.payload } as unknown as Message,
      ]);
    });
  };

  listener();
  return (
    <div className="container">
      <div>
        <input type="text" onChange={onChangeInput} />
        <button
          type="button"
          style={{ backgroundColor: "#c9f9c9" }}
          onClick={sendOutput}
        >
          送信
        </button>
      </div>
      <div className="data-lists">
        <div>
          <h3>javascript to rust</h3>
          <ul>
            {outputs.map((output) => {
              return (
                <li>
                  time: {output.timestamp} message: {output.message}
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3>rust to javascript</h3>
          <ul>
            {inputs.map((input) => {
              return (
                <li>
                  time: {input.timestamp} message: {input.message}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
