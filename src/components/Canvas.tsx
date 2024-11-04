import React, { forwardRef, useImperativeHandle, useCallback } from "react";
import { Tldraw, AssetRecordType, Editor, TLUiComponents } from "tldraw";
import "tldraw/tldraw.css";
//import "./Canvas.css";

const components: Required<TLUiComponents> = {
  ContextMenu: null,
  ActionsMenu: null,
  HelpMenu: null,
  ZoomMenu: null,
  MainMenu: null,
  Minimap: null,
  StylePanel: null,
  PageMenu: null,
  NavigationPanel: null,
  Toolbar: null,
  KeyboardShortcutsDialog: null,
  QuickActions: null,
  HelperButtons: null,
  DebugPanel: null,
  DebugMenu: null,
  SharePanel: null,
  MenuPanel: null,
  TopPanel: null,
  CursorChatBubble: null,
};

type CanvasProps = {};

export interface CanvasRef {
  clear: () => void;
  addAsset: (imgsrc: string, height: number, width: number) => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const editorRef = React.useRef<Editor | null>(null);
  useImperativeHandle(ref, () => ({
    clear() {
      // Clear the canvas
      let editor = editorRef.current;
      if (editor) {
        let shapes = editor.getCurrentPageShapes();
        editor.deleteShapes(shapes);
      }
    },
    addAsset(imgsrc, width, height) {
      let editor = editorRef.current;
      if (editor) {
        const assetId = AssetRecordType.createId();
        const imageWidth = height;
        const imageHeight = width;
        editor.createAssets([
          {
            id: assetId,
            type: "image",
            typeName: "asset",
            props: {
              name: "test",
              src: imgsrc, // You could also use a base64 encoded string here
              w: imageWidth,
              h: imageHeight,
              mimeType: null,
              isAnimated: false,
            },
            meta: {},
          },
        ]);
        editor.createShape({
          type: "image",
          // Let's center the image in the editor
          x: (window.innerWidth - imageWidth) / 2,
          y: (window.innerHeight - imageHeight) / 2,
          props: {
            assetId,
            w: imageWidth,
            h: imageHeight,
          },
        });
      }
    },
  }));

  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw inferDarkMode components={components} onMount={handleMount} />
    </div>
  );
});

export default Canvas;
