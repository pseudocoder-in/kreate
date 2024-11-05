import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useEffect,
} from "react";
import {
  Tldraw,
  AssetRecordType,
  Editor,
  TLUiComponents,
  ContextMenu,
  createShapeId,
  TLShapeId,
  TLAssetId,
} from "tldraw";

import { useKreateStore } from "../store";

import { components } from "./canvas/KreateMenu";
import "tldraw/tldraw.css";
//import "./Canvas.css";

type CanvasProps = {};

export interface CanvasRef {
  clear: () => void;
  addAsset: (imgsrc: string, height: number, width: number) => void;
  addPlaceholder: (
    imageWidth: number,
    imageHeight: number,
    prompt: string,
  ) => TLShapeId;
  removePlaceholder: (id: TLShapeId) => void;
}

const Canvas = forwardRef<CanvasRef, CanvasProps>((props, ref) => {
  const editorRef = useRef<Editor | null>(null);
  const setTldrawEditor = useKreateStore((state) => state.setTldrawEditor);
  const [assetId, setAssetId] = useState<TLAssetId | null>(null);
  useImperativeHandle(ref, () => ({
    clear() {
      // Clear the canvas
      let editor = editorRef.current;
      if (editor) {
        let shapes = editor.getCurrentPageShapes();
        editor.deleteShapes(shapes);
      }
    },
    removePlaceholder(id) {
      let editor = editorRef.current;
      if (editor) {
        editor.deleteShape(id);
      }
    },
    addPlaceholder(imageWidth, imageHeight, prompt) {
      const assetId = AssetRecordType.createId();
      const placeholderId = createShapeId();
      setAssetId(assetId);
      let editor = editorRef.current;
      if (editor) {
        let bound = editor.getViewportPageBounds();
        let scale = editor.getZoomLevel();
        editor.createShape({
          id: placeholderId,
          type: "image",
          // Let's center the image in the editor
          x: bound.x + bound.width / 2 - imageWidth / (scale * 2),
          y: bound.y + bound.height / 2 - imageHeight / (scale * 2),
          props: {
            assetId,
            w: imageWidth / scale,
            h: imageHeight / scale,
          },
          meta: {
            prompt,
          },
        });
        // TODO: Create a temp assetId and return it
        // so that we can remove this placeholder in case of failure
        return placeholderId;
      }
      return placeholderId;
    },
    addAsset(imgsrc, width, height) {
      let editor = editorRef.current;
      if (editor) {
        const imageWidth = height;
        const imageHeight = width;
        editor.createAssets([
          {
            id: assetId!,
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
      }
    },
  }));

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      setTldrawEditor(editor);
    }
  }, [setTldrawEditor, editorRef.current]);

  const handleEvent = useCallback((event) => {
    //console.log(event);
  }, []);

  const handleMount = useCallback((editor: Editor) => {
    editorRef.current = editor;
    //editor.on("event", (event) => handleEvent(event));
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw inferDarkMode components={components} onMount={handleMount} />
    </div>
  );
});

export default Canvas;
