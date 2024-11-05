import {
  Editor,
  TLShapeId,
  createShapeId,
  AssetRecordType,
  TLAssetId,
} from "tldraw";

export const clear = (editor: Editor) => {
  if (editor) {
    let shapes = editor.getCurrentPageShapes();
    editor.deleteShapes(shapes);
  }
};

export const removePlaceholder = (editor: Editor, id: TLShapeId) => {
  if (editor) {
    editor.deleteShape(id);
  }
};

export const addPlaceholder = (
  editor: Editor,
  imageWidth: number,
  imageHeight: number,
  prompt: string,
) => {
  const assetId = AssetRecordType.createId();
  const placeholderId = createShapeId();
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
    return { assetId, placeholderId };
  }
  return { assetId, placeholderId };
};

export const addAsset = (
  editor: Editor,
  assetId: TLAssetId,
  imgsrc: string,
  width: number,
  height: number,
) => {
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
};
