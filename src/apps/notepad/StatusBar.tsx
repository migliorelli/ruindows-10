import styled from "styled-components";
import { NotepadCursor } from "./Notepad";

const NotepadStatusBarRoot = styled.div`
  height: 1.5rem;
  width: 100%;
  background-color: #f0f0f0;
  border-top: 1px lightgray solid;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const NotepadStatusBarCell = styled.div`
  border-left: 1px lightgray solid;
  font-size: small;
  padding-inline: 0.5rem;
  user-select: none;
`;

type NotepadStatusBarProps = {
  cursor: NotepadCursor;
  zoom: number;
};

const NotepadStatusBar = ({ cursor, zoom }: NotepadStatusBarProps) => {
  return (
    <NotepadStatusBarRoot>
      <NotepadStatusBarCell style={{ paddingRight: "5rem" }}>
        Ln {cursor.row}, Col {cursor.col}
      </NotepadStatusBarCell>
      <NotepadStatusBarCell style={{ paddingRight: "1rem" }}>
        {Math.round(100 * zoom)}%
      </NotepadStatusBarCell>
      <NotepadStatusBarCell style={{ paddingRight: "2rem" }}>
        Ruindows (CRLF)
      </NotepadStatusBarCell>
      <NotepadStatusBarCell style={{ paddingRight: "5rem" }}>
        UTF-8
      </NotepadStatusBarCell>
    </NotepadStatusBarRoot>
  );
};

export default NotepadStatusBar;
