import React, { useEffect, useState } from "react";
import { DefaultToolbar } from "tldraw";
import { Divider, Stack } from "@mui/material";

import { useDialogs, useToasts } from "tldraw";

import { KreateSettingsDialog } from "./KreateSettingsDialog";

import { Editor } from "tldraw";
import { useKreateStore, loadDefaultSettings } from "../../store";
import {
  addAsset,
  addPlaceholder,
  removePlaceholder,
} from "../../utils/editorUtils";

import { genrateUsingHF } from "../../generators/services";
import { convertBlobToDataURL } from "../../utils";

export const KreateToolBar = (props) => {
  const [prompt, setPrompt] = useState("");
  const [imageHeight, setImageHeight] = useState(1024);
  const [imageWidth, setImageWidth] = useState(1024);
  const tldrawEditor: Editor = useKreateStore((state) => state.tldrawEditor);

  const { addDialog } = useDialogs();
  const settings = useKreateStore.getState().settings;

  useEffect(() => {
    if (settings) {
      setImageHeight(settings.imageHeight);
      setImageWidth(settings.imageWidth);
    }
  }, [settings]);

  const onGenerate = async () => {
    let { assetId, placeholderId } = addPlaceholder(
      tldrawEditor,
      400,
      400 * (imageHeight / imageWidth),
      prompt,
    );
    tldrawEditor.setSelectedShapes([placeholderId]);
    const pref = useKreateStore.getState().hfPreference;
    //const currSettings = settings || loadDefaultSettings();
    try {
      let blob = await genrateUsingHF({
        modelEndpoint: pref?.hfModel ? pref.hfModel : "",
        token: pref?.accessToken ? pref.accessToken : "",
        prompt: prompt,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
      });
      const imgsrc = await convertBlobToDataURL(blob);
      addAsset(tldrawEditor, assetId, imgsrc, imageWidth, imageHeight);
    } catch (e) {
      console.log(e);
      removePlaceholder(tldrawEditor, placeholderId);
    }
  };

  return (
    <DefaultToolbar {...props}>
      <Stack direction="row" spacing={2} padding={1} alignItems={"center"}>
        <Stack direction="row" alignItems={"center"} paddingLeft={1}>
          W: &nbsp;
          <input
            id="imageWidth"
            value={imageWidth}
            style={{ width: "70px" }}
            onChange={(e) => {
              setImageWidth(
                e.target.value != "" ? parseInt(e.target.value) : 0,
              );
            }}
          />
        </Stack>
        <Stack direction="row" alignItems={"center"}>
          H: &nbsp;
          <input
            id="imageHeight"
            value={imageHeight}
            style={{ width: "70px" }}
            onChange={(e) => {
              setImageHeight(
                e.target.value != "" ? parseInt(e.target.value) : 0,
              );
            }}
          />
        </Stack>
        <Divider orientation="vertical" flexItem />
        <input
          id="prompt-basic"
          value={prompt}
          style={{ width: "500px" }}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={onGenerate}>Generate</button>
        <Divider orientation="vertical" flexItem />
        <button
          onClick={() => {
            addDialog({
              component: KreateSettingsDialog,
              onClose() {
                // You can do something after the dialog is closed
                void null;
              },
            });
          }}
        >
          Settings
        </button>
      </Stack>
    </DefaultToolbar>
  );
};
