import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";

const SettingsDialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin: auto;
  z-index: 100;
  background-color: #222;
  height: 600px;
  width: 600px;
  border-radius: 10px;
  padding: 20px;
`;

const SettingsPanel = (props) => {
  const [acessToken, setAccessToken] = useState(props.accessToken || "");
  const [t2iModel, setT2iModel] = useState(props.t2iModel || "");
  const [t2iModels, setT2iModels] = useState(props.t2iModels || []);
  const [newModel, setNewModel] = useState("");
  const [inPaintingModel, setInPaintingModel] = useState(
    props.inPaintingModel || "",
  );

  const onClose = (update: boolean) => {
    props.onClose({
      accessToken: update ? acessToken : props.accessToken,
      t2iModel: update ? t2iModel : props.t2iModel,
      t2iModels: update ? t2iModels : props.t2iModels,
      inPaintingModel: update ? inPaintingModel : props.inPaintingModel,
    });
  };

  return (
    <SettingsDialog>
      <Stack direction="column" spacing={4} width={"100%"}>
        <Stack
          direction="column"
          spacing={2}
          marginY={"10px"}
          overflow={"auto"}
        >
          <TextField
            label="Select T2I Model"
            fullWidth={true}
            select={true}
            size="small"
            style={{ marginTop: "10px" }}
            defaultValue={t2iModel}
            onChange={(e) => setT2iModel(e.target.value)}
          >
            {t2iModels.map((model: string, index: number) => (
              <MenuItem key={index} value={model} selected={model == t2iModel}>
                <Stack
                  direction="row"
                  spacing={2}
                  width={"100%"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  {model.split("/").pop()}
                  <IconButton
                    onClick={() => {
                      const newModels = [
                        ...t2iModels.slice(0, index),
                        ...t2iModels.slice(index + 1),
                      ];
                      setT2iModels(newModels);
                    }}
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                </Stack>
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Add new model"
            variant="outlined"
            value={newModel}
            fullWidth={true}
            onChange={(e) => {
              setNewModel(e.target.value);
            }}
          />
          <IconButton
            onClick={() => {
              let newModels = t2iModels;
              newModels.push(newModel);
              setT2iModels(newModels);
              setNewModel("");
            }}
          >
            <AddCircleIcon />
          </IconButton>
        </Stack>

        {/* <TextField
          label="In-Painting Model"
          variant="outlined"
          value={inPaintingModel}
          fullWidth={true}
          onChange={(e) => setInPaintingModel(e.target.value)}
        /> */}
      </Stack>
      <Stack direction="column" spacing={2} marginTop={"auto"} width={"100%"}>
        <TextField
          label="Access Token"
          variant="outlined"
          value={acessToken}
          fullWidth={true}
          type="password"
          onChange={(e) => setAccessToken(e.target.value)}
        />
        <Stack
          direction="row"
          spacing={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Button onClick={() => onClose(true)}>Ok</Button>
          <Button onClick={() => onClose(false)}>Cancel</Button>
        </Stack>
      </Stack>
    </SettingsDialog>
  );
};

export default SettingsPanel;
