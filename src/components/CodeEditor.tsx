"use client";

import Editor from "@monaco-editor/react";

export function CodeEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="overflow-hidden rounded-md border border-zinc-800 bg-zinc-950">
      <Editor
        height="430px"
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontLigatures: false,
          tabSize: 4,
          wordWrap: "on",
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnEnter: "off",
          parameterHints: { enabled: false },
          formatOnType: false,
          formatOnPaste: false,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
}

