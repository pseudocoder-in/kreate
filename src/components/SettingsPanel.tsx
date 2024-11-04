import React, { useState } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

const SettingsDialog = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  margin: auto;
  z-index: 100;
  background-color: #222;
  height: 400px;
  width: 600px;
  border-radius: 10px;
  padding: 20px;
`;

const SettingsPanel = (props) => {
  const [acessToken, setAccessToken] = useState(props.accessToken || "");
  const [t2iModel, setT2iModel] = useState(props.t2iModel || "");
  const [inPaintingModel, setInPaintingModel] = useState(
    props.inPaintingModel || "",
  );

  const onClose = (update: boolean) => {
    let token = update ? acessToken : props.accessToken;
    props.onClose({
      accessToken: token,
      t2iModel: t2iModel,
      inPaintingModel: inPaintingModel,
    });
  };

  return (
    <SettingsDialog>
      <Stack direction="column" spacing={4} width={"100%"}>
        <TextField
          label="Text To Image Model"
          variant="outlined"
          value={t2iModel}
          fullWidth={true}
          onChange={(e) => setT2iModel(e.target.value)}
        />
        <TextField
          label="In-Painting Model"
          variant="outlined"
          value={inPaintingModel}
          fullWidth={true}
          onChange={(e) => setInPaintingModel(e.target.value)}
        />
        <TextField
          label="Access Token"
          variant="outlined"
          value={acessToken}
          fullWidth={true}
          onChange={(e) => setAccessToken(e.target.value)}
        />
      </Stack>
      <Stack direction="row" spacing={2} marginTop={"auto"}>
        <Button onClick={() => onClose(true)}>Ok</Button>
        <Button onClick={() => onClose(false)}>Cancel</Button>
      </Stack>
    </SettingsDialog>
  );
};

export default SettingsPanel;
