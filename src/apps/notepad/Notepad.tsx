import styled from "styled-components";
import Window, { WindowProps } from "../../components/window/Window";
import { ChangeEvent, useRef, useState } from "react";
import NotepadHeader from "./Header";
import NotepadStatusBar from "./StatusBar";
import { saveAs } from "file-saver";
import { useActivity } from "../../contexts/AcitivityContext";

export type NotepadCursor = {
  row: number;
  col: number;
};

export type NotepadSelection = {
  start: number | null;
  end: number | null;
};

const NotepadRoot = styled.div`
  height: 100%;
  width: 100%;

  display: flex;
  flex-direction: column;
`;

type NotepadTextareaProps = {
  zoom: number;
};

const NotepadTextarea = styled.textarea<NotepadTextareaProps>`
  flex: 1;
  width: 100%;
  outline: none;
  padding: 0.5rem;
  resize: none;
  border: none;

  font-family: "Courier New", Courier, monospace;
  font-size: ${(props) => props.zoom * 1}rem;
`;

const Notepad = (props: WindowProps) => {
  const { killProcess, openProcess } = useActivity();
  const [content, setContent] = useState("Made with react!");
  const [history, setHistory] = useState<string[]>([""]);

  const [title, setTitle] = useState("Untiled.txt");
  const [showStatusBar, setShowStatusBar] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [cursor, setCursor] = useState<NotepadCursor>({ row: 0, col: 0 });
  const [selection, setSelection] = useState<NotepadSelection>({
    start: 0,
    end: null,
  });

  const textarea = useRef<HTMLTextAreaElement | null>(null);

  const handleSetContent = (text: string) => {
    setContent(text);
    setHistory((prevHistory) => [...prevHistory, text]);
  };

  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    handleSetContent(event.target.value);
  };

  const onUndo = () => {
    if (history.length > 0) {
      setContent(history[history.length - 1]);
      setHistory(history.slice(0, history.length - 1));
    }
  };

  const onCopy = () => {
    if (textarea.current && selection.start != null && selection.end != null) {
      const selectedText = textarea.current.value.substring(
        selection.start,
        selection.end
      );

      navigator.clipboard.writeText(selectedText);
    }
  };

  const onCut = () => {
    if (textarea.current && selection.start != null && selection.end != null) {
      const newContent =
        content.slice(0, selection.start) + content.slice(selection.end + 1);
      const selectedText = textarea.current.value.substring(
        selection.start,
        selection.end
      );

      navigator.clipboard.writeText(selectedText);
      handleSetContent(newContent);
    }
  };

  const onDelete = () => {
    if (textarea.current && selection.start != null && selection.end != null) {
      const newContent =
        content.slice(0, selection.start) + content.slice(selection.end + 1);

      handleSetContent(newContent);
    }
  };

  const onPaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    if (!clipboardText) return;

    if (textarea.current && selection.start != null && selection.end != null) {
      const newContentStart = content.slice(0, selection.start);

      if (selection.start != selection.end) {
        const newContentEnd = content.slice(selection.end + 1);
        const newContent = newContentStart + clipboardText + newContentEnd;
        handleSetContent(newContent);
      } else {
        const newContentEnd = content.slice(selection.end, content.length);
        const newContent = newContentStart + clipboardText + newContentEnd;
        handleSetContent(newContent);
      }
    }
  };

  const onIncreaseZoom = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
  };

  const onReduceZoom = () => {
    setZoom((prevZoom) => prevZoom - 0.1);
  };

  const onResetZoom = () => {
    setZoom(1);
  };

  const onToggleStatusBar = () => {
    setShowStatusBar((prev) => !prev);
  };

  const onClose = () => {
    killProcess(props.id);
  };

  const onSave = () => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, title);
  };

  const onNewWindow = () => {
    openProcess(props.type);
  };

  const onNew = () => {
    setContent("");
    setHistory([]);
    setTitle("Untiled.txt");
  };

  const onOpen = () => {
    // create input for file upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt";

    // on file selected
    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        const reader = new FileReader();

        // read file as text
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const fileContent = e.target?.result as string;
          setTitle(file.name);
          setContent(fileContent);
        };

        // read the file
        reader.readAsText(file);

        // remove the input
        input.remove();
      }
    };
    input.click();
  };

  const handleSelection = () => {
    if (textarea.current) {
      const selectionStart = textarea.current.selectionStart;
      const textBeforeCursor = textarea.current.value.substring(
        0,
        selectionStart
      );

      const lines = textBeforeCursor.split("\n");
      const row = lines.length;
      const col = lines[lines.length - 1].length + 1;

      setCursor({ row, col });
    }
  };

  const handleOnSelect = () => {
    setSelection({
      start: textarea.current?.selectionStart || 0,
      end: textarea.current?.selectionEnd || null,
    });
  };

  return (
    <Window {...props} title={`${title} - Notepad`}>
      <NotepadRoot>
        <NotepadHeader
          onUndo={onUndo}
          onCopy={onCopy}
          onCut={onCut}
          onDelete={onDelete}
          onOpen={onOpen}
          onNewWindow={onNewWindow}
          onNew={onNew}
          onSave={onSave}
          onSaveAs={onSave}
          onClose={onClose}
          onPaste={onPaste}
          onIncreaseZoom={onIncreaseZoom}
          onReduceZoom={onReduceZoom}
          onResetZoom={onResetZoom}
          onToggleStatusBar={onToggleStatusBar}
          showStatusBar={showStatusBar}
        />
        <NotepadTextarea
          ref={textarea}
          zoom={zoom}
          onChange={onChange}
          value={content}
          onClick={handleSelection}
          onKeyUp={handleSelection}
          onSelect={handleOnSelect}
        />
        {showStatusBar && <NotepadStatusBar cursor={cursor} zoom={zoom} />}
      </NotepadRoot>
    </Window>
  );
};

export default Notepad;
