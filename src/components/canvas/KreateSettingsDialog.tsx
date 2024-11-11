import { useEffect, useState } from "react";
import {
  TldrawUiButton,
  TldrawUiButtonLabel,
  TldrawUiDialogBody,
  TldrawUiDialogCloseButton,
  TldrawUiDialogFooter,
  TldrawUiDialogHeader,
  TldrawUiDialogTitle,
} from "tldraw";
import "tldraw/tldraw.css";

import {
  HF_ACCESS_TOKEN,
  HF_PREFERENCE,
  HF_T2I_MODEL,
  HF_T2I_MODELS,
} from "../../utils/constants";
import { loadPreference, savePreference } from "../../utils";

import { useKreateStore } from "../../store";
import { Stack } from "@mui/material";

export const KreateSettingsDialog = ({ onClose }: { onClose(): void }) => {
  const [hfModel, setHfModel] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [hfModels, setHfModels] = useState([""]);
  const [newModel, setNewModel] = useState("");

  const setHFPreference = useKreateStore((state) => state.setHFPreference);
  const pref = useKreateStore.getState().hfPreference;
  console.log("pref at beging");
  console.log(pref);

  useEffect(() => {
    console.log("in useeffect");
    console.log(pref);
    if (pref && pref.hfModel && pref.hfModels) {
      console.log(pref);
      setHfModel(pref.hfModel);
      setAccessToken(pref.accessToken);
      setHfModels(pref.hfModels);
    }
  }, [pref]);

  const onDialogClose = (update: boolean) => {
    if (update) {
      setHFPreference({ hfModel, accessToken, hfModels });
      let preference = loadPreference();
      preference[HF_PREFERENCE] = {
        [HF_ACCESS_TOKEN]: accessToken,
        [HF_T2I_MODEL]: hfModel,
        [HF_T2I_MODELS]: hfModels,
      };
      savePreference(preference);
    }
    onClose();
  };

  const onModelAddition = () => {
    if (newModel && !hfModels.includes(newModel)) {
      setHfModels([...hfModels, newModel]);
      setNewModel("");
    }
  };

  return (
    <>
      <TldrawUiDialogHeader>
        <TldrawUiDialogTitle>Preference</TldrawUiDialogTitle>
        <TldrawUiDialogCloseButton />
      </TldrawUiDialogHeader>
      <TldrawUiDialogBody style={{ width: 600 }}>
        <Stack direction={"row"} spacing={2} padding={1} alignItems={"center"}>
          <label style={{ textWrap: "nowrap" }} className="tlui-form__label">
            Select Model
          </label>
          <select
            style={{ width: "460px" }}
            value={hfModel}
            onChange={(e) => setHfModel(e.target.value)}
          >
            {hfModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </Stack>
        <Stack direction={"row"} spacing={2} padding={1} alignItems={"center"}>
          <label style={{ textWrap: "nowrap" }}>Add Model</label>
          <input
            type="text"
            value={newModel}
            style={{ width: "100%" }}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <TldrawUiButton type="normal" onClick={() => onModelAddition()}>
            <TldrawUiButtonLabel>Add</TldrawUiButtonLabel>
          </TldrawUiButton>
        </Stack>
        <Stack direction={"row"} spacing={2} padding={1} alignItems={"center"}>
          <label style={{ textWrap: "nowrap" }}>Access Token</label>
          <input
            type="password"
            value={accessToken}
            style={{ width: "100%" }}
            onChange={(e) => setAccessToken(e.target.value)}
          />
        </Stack>
      </TldrawUiDialogBody>
      <TldrawUiDialogFooter className="tlui-dialog__footer__actions">
        <TldrawUiButton type="primary" onClick={() => onDialogClose(true)}>
          <TldrawUiButtonLabel>Ok</TldrawUiButtonLabel>
        </TldrawUiButton>
        <TldrawUiButton type="normal" onClick={() => onDialogClose(false)}>
          <TldrawUiButtonLabel>Cancel</TldrawUiButtonLabel>
        </TldrawUiButton>
      </TldrawUiDialogFooter>
    </>
  );
};
