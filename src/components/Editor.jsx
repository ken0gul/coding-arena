import React, { useEffect, useRef } from "react";
import MonacoEditor from "react-monaco-editor";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "../components/Editor.styles.css";

const Editor = ({ setOutput }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    monaco.languages.register({
      id: "java",
    });
    // Enable autocompletion and suggestion
    monaco.languages.registerCompletionItemProvider("java", {
      provideCompletionItems: (model, position) => {
        // Add your own logic to provide completion items based on the current context
        const suggestions = [
          {
            label: "System",
            kind: monaco.languages.CompletionItemKind.Class,
            insertText: "System",
            range: new monaco.Range(
              position.lineNumber,
              position.column - 1,
              position.lineNumber,
              position.column - 1
            ),
          },
          // Add more completion items as needed
        ];

        return {
          suggestions: suggestions,
        };
      },
    });

    // Enable auto-closing brackets
    monaco.languages.setLanguageConfiguration("java", {
      brackets: [
        ["{", "}"],
        ["(", ")"],
        ["[", "]"],
      ],
      autoClosingPairs: [
        { open: "{", close: "}" },
        { open: "(", close: ")" },
        { open: "[", close: "]" },
        { open: "'", close: "'", notIn: ["string", "comment"] },
        { open: '"', close: '"', notIn: ["string"] },
      ],
    });
    monaco.languages.setLanguageConfiguration("java", {
      // Language specific configuration options if needed
    });
    monaco.languages.registerCompletionItemProvider("java", {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: "System",
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: "System",
            },
            {
              label: "out",
              kind: monaco.languages.CompletionItemKind.Field,
              insertText: "out",
            },
            // Add more suggestions as needed
          ],
        };
      },
    });
    monaco.languages.setMonarchTokensProvider("java", {
      tokenizer: {
        root: [
          // Keywords
          [
            /(abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|module|native|new|null|opens|package|private|protected|provides|public|requires|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|void|volatile|while)\b/,
            "keyword",
          ],
          // Modifiers
          [
            /(public|protected|private|abstract|static|final|transient|volatile|synchronized|native|strictfp)\b/,
            "modifier",
          ],
          // Types
          [/([A-Z][a-zA-Z_$0-9]*)(<.*?>)?/, "type"],
          // Annotations
          [/@\w*/, "annotation"],
          // Variables and methods
          [/[\w$][\w$]*(?=\()/, "function"],
          // Comments
          [/(\/\/.*)|(\/\*[\s\S]*?\*\/)/, "comment"],
          // Strings
          [/(".*?")|('.*?')/, "string"],
          // Numbers
          [
            /\b(\d+(\.\d*)?([eE][+-]?\d+)?[lLfFdD]?|0[xX][\da-fA-F]+)\b/,
            "number",
          ],
          // Operators and punctuation
          // [/[+\-*/=<>!&|~^%]+|\?\:?|[\[\](){}.,:;]/, "operator"],
          // // Brackets
          // [/[()\[\]{}]/, "@brackets"],
        ],
      },
      // Provide additional options to fine-tune the syntax highlighting
      // such as brackets matching, folding, etc.
      // Refer to the Monaco editor documentation for more details.
      // ...
    });
  }, []);
  const executeJavaCode = async () => {
    const editor = editorRef.current;
    const code = editor.getValue();

    try {
      const response = await fetch("http://localhost:3001/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      const result = await response.json();

      setOutput(result.output);
    } catch (error) {
      console.error(error);
      setOutput("Error occurred during code execution.");
    }
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <MonacoEditor
          id="monaco-editor"
          width="100%"
          height="400"
          language="java"
          theme="vs-dark"
          value={`public class Code {
          public static void main(String[] args) {
            // Always use "System.out.print()"
            System.out.print("Hello, World!");
          }
        }`}
          options={{
            autoIndent: "advanced",
            contextmenu: true,

            fontSize: 15,
            lineHeight: 24,
            hideCursorInOverviewRuler: true,
            matchBrackets: "always",
            suggest: {
              // Enable built-in Monaco suggestions
              show: true,
              // Control how many suggestions to show in the dropdown
              maxSuggestions: 10,
            },
            extraLibraries: [
              // Add additional libraries for better Java autocompletion
              {
                path: "https://cdnjs.cloudflare.com/ajax/libs/java/0.2.7/java.d.ts",
                rawContent: "",
              },
            ],

            minimap: {
              enabled: true,
            },
            scrollbar: {
              horizontalSliderSize: 4,
              verticalSliderSize: 18,
            },
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            automaticLayout: true,
            autoClosingBrackets: "always",
            bracketPairColorization: true,
            scrollBeyondLastLine: false,

            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontWeight: "600",
          }}
          editorDidMount={(editor) => {
            editorRef.current = editor;
          }}
        />
        <button className="btn execute-button" onClick={executeJavaCode}>
          Execute
        </button>
        <button className="btn reset-button">Reset</button>
      </div>
    </>
  );
};

export default Editor;
