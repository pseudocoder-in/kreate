import React, { useRef, useCallback, useEffect } from "react";
import { Tldraw, Editor } from "tldraw";

import { useKreateStore } from "../store";

import { components } from "./canvas/KreateUIComponents";
import "tldraw/tldraw.css";
//import "./Canvas.css";

const Canvas = () => {
  const editorRef = useRef<Editor | null>(null);
  const setTldrawEditor = useKreateStore((state) => state.setTldrawEditor);

  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
    //editor.options.defaultSvgPadding = 0;
    if (editor) {
      setTldrawEditor(editor);
    }
    //editor.on("event", (event) => handleEvent(event));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        inferDarkMode
        components={components}
        onMount={handleMount}
        persistenceKey="kreate-canvas"
      />
    </div>
  );
};

export default Canvas;
