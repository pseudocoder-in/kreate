import {
  TLUiComponents,
  TLUiContextMenuProps,
  TLUiActionsMenuProps,
} from "tldraw";
import {
  DefaultContextMenu,
  DefaultContextMenuContent,
  ArrangeMenuSubmenu,
  ReorderMenuSubmenu,
  CutMenuItem,
  CopyMenuItem,
  PasteMenuItem,
  DuplicateMenuItem,
  DeleteMenuItem,
  ExportFileContentSubMenu,
  CopyAsMenuGroup,
  SelectAllMenuItem,
} from "tldraw";
import { TldrawUiMenuGroup, TldrawUiMenuItem } from "tldraw";

import { Editor } from "tldraw";
import { useKreateStore } from "../../store";

const KreateContextMenu = (props: TLUiContextMenuProps) => {
  const tldrawEditor: Editor = useKreateStore((state) => state.tldrawEditor);

  const copyPrompt = (evt) => {
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

  return (
    <DefaultContextMenu {...props}>
      <TldrawUiMenuGroup id="prompt">
        <TldrawUiMenuItem
          id="prompt"
          label="Copy Prompt"
          icon="external-link"
          readonlyOk
          onSelect={copyPrompt}
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
      <TldrawUiMenuGroup id="export_operation">
        <ExportFileContentSubMenu />
        <CopyAsMenuGroup />
      </TldrawUiMenuGroup>
      <SelectAllMenuItem />
    </DefaultContextMenu>
  );
};

export const components: Required<TLUiComponents> = {
  ActionsMenu: null,
  ContextMenu: KreateContextMenu,
  DebugMenu: null,
  HelpMenu: null,
  KeyboardShortcutsDialog: null,
  MainMenu: null,
  NavigationPanel: null,
  PageMenu: null,
  QuickActions: null,
  StylePanel: null,
  Toolbar: null,
  ZoomMenu: null,
  Minimap: null,
  HelperButtons: null,
  DebugPanel: null,
  MenuPanel: null,
  TopPanel: null,
  SharePanel: null,
  CursorChatBubble: null,
};
