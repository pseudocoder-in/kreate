import styled from "styled-components";
import Canvas from "./components/Canvas";

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

function App() {
  return (
    <Container>
      <Canvas />
    </Container>
  );
}

export default App;
