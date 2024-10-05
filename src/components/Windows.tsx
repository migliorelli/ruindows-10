import Window from "./window/Window";
import Notepad from "../apps/notepad/Notepad";
import Chrome from "../apps/chrome/Chrome";
import { Process, useActivity } from "../contexts/AcitivityContext";
import VSCode from "../apps/vscode/VSCode";

const Windows = () => {
  const { processes } = useActivity();

  const renderProcess = (process: Process) => {
    switch (process.type) {
      case 1:
        return (
          <Notepad
            type={process.type}
            minimized={process.minimized}
            id={process.id}
            key={process.id}
            zIndex={process.zIndex}
          />
        );
      case 2:
        return (
          <Chrome
            type={process.type}
            minimized={process.minimized}
            id={process.id}
            key={process.id}
            zIndex={process.zIndex}
          />
        );
      case 3:
        return (
          <VSCode
            type={process.type}
            minimized={process.minimized}
            id={process.id}
            key={process.id}
            zIndex={process.zIndex}
          />
        );
      default:
        return (
          <Window
            type={process.type}
            minimized={process.minimized}
            id={process.id}
            key={process.id}
            zIndex={process.zIndex}
          />
        );
    }
  };

  return processes.map((process) => renderProcess(process));
};

export default Windows;
