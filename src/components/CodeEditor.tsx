import React, { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as monacoEditor from "monaco-editor";
import { getCodeSuggestions } from "../utils/openai";

const CodeEditor: React.FC = () => {
  const [code, setCode] = useState<string>("// Start typing your code...");
  const [output, setOutput] = useState<string>("");

  const handleEditorWillMount = (monaco: typeof monacoEditor) => {
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: async (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        // Get suggestions from OpenAI
        const suggestionsFromOpenAI = await getCodeSuggestions(model.getValue(), {
          line: position.lineNumber,
          character: position.column,
        });

        const suggestions: monacoEditor.languages.CompletionItem[] = [
          {
            label: "console.log",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "console.log()",
            documentation: "Log output to console",
            range: range,
          },
          {
            label: "setTimeout",
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: "setTimeout(() => {}, 1000);",
            documentation: "Run function after a delay",
            range: range,
          },
          // Add OpenAI suggestions to the list
          ...suggestionsFromOpenAI.split('\n').map(suggestion => ({
            label: suggestion,
            kind: monaco.languages.CompletionItemKind.Text,
            insertText: suggestion,
            range: range,
          }))
        ];

        return { suggestions };
      },
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) setCode(value);
  };

  const executeCode = () => {
    try {
      let outputBuffer: string[] = [];

      // Override console.log to capture the output
      const originalConsoleLog = console.log;
      console.log = (...args: any[]) => {
        outputBuffer.push(args.map(arg => String(arg)).join(" "));
      };

      // Wrap the code in a function to return its result
      const result = eval(`(() => { ${code}; return (typeof lastEval !== 'undefined' ? lastEval : undefined); })()`);

      // Restore the original console.log
      console.log = originalConsoleLog;

      // Combine captured output and the result
      const combinedOutput = outputBuffer.join("\n") + (result !== undefined ? `\nResult: ${result}` : '');
      setOutput(combinedOutput);
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div style={{ display: "flex", height: "80vh" }}>
      <MonacoEditor
        height="100%"
        width={"50%"}
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        onChange={handleEditorChange}
        beforeMount={handleEditorWillMount}
      />
      <div style={{ width: "50%", padding: "10px", backgroundColor: "#f5f5f5", overflowY: "auto" }}>
        <h3>Output</h3>
        <pre>{output}</pre>
        <button onClick={executeCode}>Run Code</button>
      </div>
    </div>
  );
};

export default CodeEditor;