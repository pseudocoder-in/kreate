import { useState, Fragment, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import styled from "styled-components";

import Canvas, { CanvasRef } from "./components/Canvas";
import SettingsPanel from "./components/SettingsPanel";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import { Refresh, Settings } from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TuneIcon from "@mui/icons-material/Tune";

import "./App.css";
import {
  loadPreference,
  savePreference,
  convertBlobToDataURL,
} from "./utils/utils";
import { genrateUsingHF } from "./generators/services";

import {
  HF_PREFERENCE,
  HF_ACCESS_TOKEN,
  HF_T2I_MODEL,
  HF_T2I_MODELS,
  HF_INPAINTING_MODEL,
} from "./utils/constants";

const Container = styled.div`
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 900px;
  min-width: 1200px;
`;

const ToolBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  z-index: 1000;
  background-color: #202025;
  padding: 10px;
  width: fit-content;
  ner-radius: 10px;
  border-radius: 10px;
`;

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [accessToken, setAccessToken] = useState("");
  const [t2iModels, setT2iModels] = useState([
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  ]);
  const [t2iModel, setT2iModel] = useState(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  );
  const [inPaintingModel, setInPaintingModel] = useState(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [imageWidth, setImageWidth] = useState(1024);
  const [imageHeight, setImageHeight] = useState(1024);

  const [editModeEl, setEditModeEl] = useState<null | HTMLElement>(null);
  const [mode, setMode] = useState("T2I");

  const openMode = Boolean(editModeEl);

  const canvasRef = useRef<CanvasRef>(null);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  useEffect(() => {
    console.log("accessToken", accessToken);
  }, [accessToken]);

  useEffect(() => {
    const fetchToken = async () => {
      setAccessToken(await invoke("get_env", { name: "ACCESS_TOKEN" }));
    };
    let preference = loadPreference();
    let hfPreference = preference[HF_PREFERENCE];
    if (!hfPreference || !hfPreference[HF_ACCESS_TOKEN]) fetchToken();
    if (!hfPreference) return;
    hfPreference[HF_ACCESS_TOKEN] &&
      setAccessToken(hfPreference[HF_ACCESS_TOKEN]);
    hfPreference[HF_T2I_MODEL] && setT2iModel(hfPreference[HF_T2I_MODEL]);
    hfPreference[HF_T2I_MODELS] && setT2iModels(hfPreference[HF_T2I_MODELS]);
    hfPreference[HF_INPAINTING_MODEL] &&
      setInPaintingModel(hfPreference[HF_INPAINTING_MODEL]);
  }, []);

  const onGenerate = async () => {
    setIsGenerating(true);
    if (canvasRef.current) {
      let tmpId = canvasRef.current.addPlaceholder(400, 400, prompt);
      try {
        let blob = await genrateUsingHF({
          modelEndpoint: t2iModel,
          token: accessToken,
          prompt,
          imageWidth,
          imageHeight,
        });
        const imgsrc = await convertBlobToDataURL(blob);
        canvasRef.current.addAsset(imgsrc, imageWidth, imageHeight);
      } catch (e) {
        console.log(e);
        setIsGenerating(false);
        canvasRef.current.removePlaceholder(tmpId);
      }
    }
    setIsGenerating(false);
  };
  const onSettings = async () => {
    setIsSettingsOpen(true);
  };

  const onClear = async () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const onSettingsClose = (props) => {
    setIsSettingsOpen(false);
    setAccessToken(props.accessToken);
    setT2iModel(props.t2iModel);
    setT2iModels(props.t2iModels);
    setInPaintingModel(props.inPaintingModel);
    let preference = loadPreference();
    preference[HF_PREFERENCE] = {
      [HF_ACCESS_TOKEN]: props.accessToken,
      [HF_T2I_MODEL]: props.t2iModel,
      [HF_T2I_MODELS]: props.t2iModels,
      [HF_INPAINTING_MODEL]: props.inPaintingModel,
    };
    savePreference(preference);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onPreferenceChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditModeClick = (event) => {
    setEditModeEl(event.currentTarget);
  };
  const handleEditModeClose = (event) => {
    let currentMode = "T2I";
    if (event.currentTarget.tabIndex == -1) currentMode = "In-Paint";
    setMode(currentMode);
    setEditModeEl(null);
  };

  return (
    <Container>
      {isSettingsOpen && (
        <SettingsPanel
          accessToken={accessToken}
          t2iModel={t2iModel}
          t2iModels={t2iModels}
          inPaintingModel={inPaintingModel}
          onClose={onSettingsClose}
        />
      )}
      <Canvas ref={canvasRef} />
      <ToolBar>
        <Stack direction="row" spacing={2}>
          <div>
            <Button
              id="basic-button"
              aria-controls={openMode ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openMode ? "true" : undefined}
              onClick={handleEditModeClick}
            >
              {mode}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={editModeEl}
              open={openMode}
              onClose={handleEditModeClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={handleEditModeClose}>T2I</MenuItem>
              <MenuItem onClick={handleEditModeClose} disabled={true}>
                In Paint
              </MenuItem>
            </Menu>
          </div>
          <TextField
            id="prompt-basic"
            value={prompt}
            style={{ width: "500px" }}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={isGenerating}
            variant="outlined"
            size="small"
          />
          <Button
            variant="contained"
            onClick={onGenerate}
            disabled={isGenerating}
          >
            Generate
          </Button>
        </Stack>
        <Divider orientation="vertical" flexItem />
        <Stack direction="row" spacing={2}>
          <IconButton onClick={onPreferenceChange}>
            <TuneIcon />
          </IconButton>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack direction="column" spacing={2} padding={2}>
              <TextField
                id="img-width"
                label="Image Width"
                variant="outlined"
                value={imageWidth}
                size="small"
                onChange={(e) => setImageWidth(parseInt(e.target.value))}
              />
              <TextField
                id="img-height"
                label="Image Height"
                variant="outlined"
                value={imageHeight}
                size="small"
                onChange={(e) => setImageHeight(parseInt(e.target.value))}
              />
            </Stack>
          </Popover>
          <IconButton onClick={onClear}>
            <Refresh />
          </IconButton>
          <IconButton onClick={onSettings}>
            <Settings />
          </IconButton>
        </Stack>
      </ToolBar>
    </Container>
  );
}

export default App;
