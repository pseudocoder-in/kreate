import { TLUiComponents } from "tldraw";
import { KreateContextMenu } from "./KreateContextMenu";
import { KreateToolBar } from "./KreateToolBar";

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
  Toolbar: KreateToolBar,
  ZoomMenu: null,
  Minimap: null,
  HelperButtons: null,
  DebugPanel: null,
  MenuPanel: null,
  TopPanel: null,
  SharePanel: null,
  CursorChatBubble: null,
};
