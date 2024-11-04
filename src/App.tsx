import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import styled from "styled-components";

import Canvas, { CanvasRef } from "./components/Canvas";
import SettingsPanel from "./components/SettingsPanel";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import { Refresh, Settings } from "@mui/icons-material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import TuneIcon from "@mui/icons-material/Tune";

import "./App.css";

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
  background-color: #222;
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
  const [t2iModel, setT2iModel] = useState(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  );
  const [inPaintingModel, setInPaintingModel] = useState(
    "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const [imageWidth, setImageWidth] = useState(512);
  const [imageHeight, setImageHeight] = useState(512);

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
    fetchToken();
  }, []);

  const getSeed = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const genrateUsingHF = async () => {
    let response = await fetch(t2iModel, {
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        target_size: {
          width: imageWidth,
          height: imageHeight,
        },
        seed: getSeed(),
      }),
    });
    console.log(response);
    const result = await response.blob();
    return result;
  };

  const convertBlobToDataURL = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const onGenerate = async () => {
    setIsGenerating(true);
    if (canvasRef.current) {
      let blob = await genrateUsingHF();
      const imgsrc = await convertBlobToDataURL(blob);
      canvasRef.current.addAsset(imgsrc, imageWidth, imageHeight);
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
    setInPaintingModel(props.inPaintingModel);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const onPreferenceChange = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Container>
      {isSettingsOpen && (
        <SettingsPanel
          accessToken={accessToken}
          t2iModel={t2iModel}
          inPaintingModel={inPaintingModel}
          onClose={onSettingsClose}
        />
      )}
      <Canvas ref={canvasRef} />
      <ToolBar>
        <Stack direction="row" spacing={2}>
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
