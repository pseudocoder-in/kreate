import {
  TLUiContextMenuProps,
  TldrawUiMenuItem,
  TldrawUiMenuGroup,
} from "tldraw";
import {
  DefaultContextMenu,
  ArrangeMenuSubmenu,
  ReorderMenuSubmenu,
  CutMenuItem,
  CopyMenuItem,
  PasteMenuItem,
  DuplicateMenuItem,
  DeleteMenuItem,
  exportToBlob,
  SelectAllMenuItem,
} from "tldraw";

import { v4 as uuidv4 } from "uuid";

import { writeFile, BaseDirectory } from "@tauri-apps/plugin-fs";

import { Editor } from "tldraw";
import { useKreateStore } from "../../store";

export const KreateContextMenu = (props: TLUiContextMenuProps) => {
  const tldrawEditor: Editor | null = useKreateStore(
    (state) => state.tldrawEditor,
  );

  const copyPrompt = () => {
    if (!tldrawEditor) return;
    const selectedElement = tldrawEditor.getSelectedShapes();
    if (selectedElement.length === 1) {
      const element = selectedElement[0];
      //console.log(element);
      if (element.meta.prompt) {
        navigator.clipboard.writeText(String(element.meta.prompt));
      }
    } else {
      console.log("please select one element");
    }
  };

  const exportImage = async () => {
    if (!tldrawEditor) return;
    const selectedElement = tldrawEditor.getSelectedShapes();
    if (selectedElement.length === 1) {
      const element = selectedElement[0];
      let blob = await exportToBlob({
        editor: tldrawEditor,
        format: "jpeg",
        ids: [element.id],
        opts: {
          scale: 1,
          background: false,
          padding: 0,
        },
      });

      // Hack to get the image data, as we are gtting black blob
      blob = await exportToBlob({
        editor: tldrawEditor,
        format: "jpeg",
        ids: [element.id],
        opts: {
          scale: 1,
          background: false,
          padding: 0,
        },
      });
      const arrayBuffer = await blob.arrayBuffer();
      const contents = new Uint8Array(arrayBuffer); // fill a byte array
      await writeFile("kreate-" + uuidv4() + ".jpeg", contents, {
        baseDir: BaseDirectory.Download,
      });
    } else {
      console.log("please select one element");
    }
  };

  return (
    <DefaultContextMenu {...props}>
      <TldrawUiMenuGroup id="kreate">
        <TldrawUiMenuItem
          id="prompt"
          label="Copy Prompt"
          icon="external-link"
          readonlyOk
          onSelect={copyPrompt}
        />
        <TldrawUiMenuItem
          id="export"
          label="Export Image"
          icon="external-link"
          readonlyOk
          onSelect={exportImage}
        />
      </TldrawUiMenuGroup>
      <TldrawUiMenuGroup id="basic_operation">
        <CutMenuItem />
        <CopyMenuItem />
        <PasteMenuItem />
        <DuplicateMenuItem />
        <DeleteMenuItem />
      </TldrawUiMenuGroup>
      <ArrangeMenuSubmenu />
      <ReorderMenuSubmenu />
      {/* <TldrawUiMenuGroup id="export_operation">
        <ExportFileContentSubMenu />
        <CopyAsMenuGroup />
      </TldrawUiMenuGroup> */}
      <SelectAllMenuItem />
    </DefaultContextMenu>
  );
};
