import styled from "styled-components";
import Window, { WindowProps } from "../../components/window/Window";

const VSCodeIframe = styled.iframe`
  height: 100%;
  width: 100%;
  border: none;
`;

const VSCode = (props: WindowProps) => {
  return (
    <Window {...props} title="Visual Studio Code">
      <VSCodeIframe src="https://vscode.dev/?vscode-lang=pt-br" />
    </Window>
  );
};

export default VSCode;
