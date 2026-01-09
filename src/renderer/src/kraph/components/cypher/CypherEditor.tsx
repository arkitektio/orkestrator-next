import { Editor, Monaco } from "@monaco-editor/react";
import OneDarkPro from "./theme.json";

export const CypherEditor = (props: { cypher: string }) => {
  const handleEditorDidMount = (monaco: Monaco) => {
    monaco.editor.defineTheme("OneDarkPro", {
      ...OneDarkPro,
    });
  };

  return (
    <Editor
      options={{
        minimap: { enabled: false },
        lineNumbers: "off",
      }}
      defaultLanguage="cypher"
      defaultValue={props.cypher}
      theme="OneDarkPro"
      beforeMount={handleEditorDidMount}
    />
  );
};
