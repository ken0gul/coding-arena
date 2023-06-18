import React from "react";
import "../components/Output.css";
export default function Output({ output }) {
  return (
    <div className="output">
      <h2>Task:</h2>
      <ul>
        <li>Create a method to reverse a given string("CodersCampus")</li>
        <li>Call the method in the main method of Code class</li>
        <li>Print out the result</li>
        <li>Expected Output: "supmaCsredoC"</li>
      </ul>
      <h2>
        Output: <br />
        <br />
        {output}
      </h2>
      <p></p>
    </div>
  );
}
