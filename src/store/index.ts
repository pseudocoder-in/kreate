import { create } from "zustand";
import { Editor } from "tldraw";
import { loadPreference } from "../utils";
import {
  HF_PREFERENCE,
  HF_T2I_MODELS,
  HF_T2I_MODEL,
  HF_ACCESS_TOKEN,
} from "../utils/constants";

export type KreateHFPreferenceProps = {
  hfModels: string[];
  hfModel: string;
  accessToken: string;
};

export type kreateSettingsProps = {
  imageWidth: number;
  imageHeight: number;
};

interface KreateStore {
  tldrawEditor: Editor | null;
  setTldrawEditor: (tldrawEditor: Editor) => void;
  hfPreference: KreateHFPreferenceProps | null;
  setHFPreference: (hfPreference: KreateHFPreferenceProps) => void;
  settings: kreateSettingsProps | null;
  setSettings: (settings: kreateSettingsProps) => void;
}

export const loadDefaultHFPreference = () => {
  let preference = loadPreference();
  let hfPreference = preference[HF_PREFERENCE];
  let loadDefault =
    !hfPreference ||
    !hfPreference[HF_T2I_MODELS] ||
    !hfPreference[HF_T2I_MODEL];
  if (loadDefault) {
    return {
      hfModels: [
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      ],
      hfModel:
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      accessToken: "",
    };
  }
  return {
    hfModels: hfPreference[HF_T2I_MODELS],
    hfModel: hfPreference[HF_T2I_MODEL],
    accessToken: hfPreference[HF_ACCESS_TOKEN],
  };
};

export const loadDefaultSettings = () => {
  return {
    imageWidth: 1024,
    imageHeight: 1024,
  };
};

export const useKreateStore = create<KreateStore>((set) => ({
  tldrawEditor: null,
  setTldrawEditor: (tldrawEditor: Editor) => set({ tldrawEditor }),
  hfPreference: loadDefaultHFPreference(),
  setHFPreference: (hfPreference: KreateHFPreferenceProps) =>
    set({ hfPreference }),
  settings: loadDefaultSettings(),
  setSettings: (settings: kreateSettingsProps) => set({ settings }),
}));
