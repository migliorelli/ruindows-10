import styled from "styled-components";
import colors from "../lib/colors";
import { useActivity } from "../contexts/AcitivityContext";
import { icons } from "../lib/util";
import StartupMenu from "./StartupMenu";

const AppButtonContainer = styled.div`
  height: 100%;
  aspect-ratio: 1/1;
  position: relative;

  display: grid;
  place-items: center;
  user-select: none;

  &:hover {
    background-color: ${colors.taskbarIconActive};
  }

  &::after {
    position: absolute;
    content: "";
    width: 100%;
    height: 5%;
    background-color: gray;
    bottom: 0;
    left: 0;
  }
`;

const AppButtonImage = styled.img`
  width: 100%;
  padding: 0.5rem;
`;

type AppButtonProps = {
  type: number;
  minimized: boolean;
  onMinimize: () => void;
  onKillProcess: () => void;
};

const AppButton = ({
  onMinimize,
  onKillProcess,
  type,
  minimized,
}: AppButtonProps) => {
  return (
    <AppButtonContainer
      style={{ opacity: minimized ? 0.5 : 1 }}
      onClick={onMinimize}
      onContextMenu={(event) => {
        event.preventDefault();
        onKillProcess();
      }}
    >
      <AppButtonImage src={icons[type]} />
    </AppButtonContainer>
  );
};

const TaskbarRoot = styled.div`
  height: 4dvh;
  width: 100vw;
  background-color: ${colors.taskbar};
  color: white;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 0.5rem;

  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 99999;
`;

const Taskbar = () => {
  const { processes, minimizeProcess, killProcess } = useActivity();

  return (
    <TaskbarRoot>
      <StartupMenu />
      {processes.map((process) => (
        <AppButton
          key={process.id}
          type={process.type}
          onMinimize={() => minimizeProcess(process.id)}
          onKillProcess={() => killProcess(process.id)}
          minimized={process.minimized}
        />
      ))}
    </TaskbarRoot>
  );
};

export default Taskbar;
