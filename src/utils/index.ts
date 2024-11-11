import { KREATE_PREFERENCE } from "./constants";

export const loadPreference = () => {
  console.log("loadPreference");
  const item = localStorage.getItem(KREATE_PREFERENCE);
  if (item) {
    let prefJson = JSON.parse(item);
    console.log(prefJson);
    return prefJson;
  }
  return {};
};

export const savePreference = (preference: any) => {
  console.log("savePreference", preference);
  let prefStr = JSON.stringify(preference);
  localStorage.setItem(KREATE_PREFERENCE, prefStr);
};

export const convertBlobToDataURL = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
