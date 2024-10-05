import styled from "styled-components";
import colors from "../lib/colors";
import { useActivity } from "../contexts/AcitivityContext";
import { icons } from "../lib/util";
import apps from "../apps/apps";

const DesktopRoot = styled.div`
  height: 96dvh;
  width: 100vw;
  background-color: #202020;
  padding: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  flex-wrap: wrap;
  background-image: url("/w10-wallpaper.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  user-select: none;
`;

const DesktopIconButton = styled.button`
  background-color: transparent;
  outline: none;
  border: 1px transparent solid;
  color: white;
  width: 75px;
  min-height: 75px;

  &:hover {
    background-color: ${colors.desktopSelection};
    border: 1px solid ${colors.desktopSelectionBorder};
  }

  &:focus {
    background-color: ${colors.desktopSelectionFocus};
    border: 1px solid ${colors.desktopSelectionFocusBorder};
  }
`;

const DesktopIconImage = styled.img`
  width: 50%;
  aspect-ratio: 1/1;
`;

const DesltopIconText = styled.span`
  text-align: center;
  font-size: small;
  font-weight: 100;
`;

type DesktopIconProps = {
  label: string;
  type: number;
  onClick: () => void;
};

const DesktopIcon = ({ label, onClick, type }: DesktopIconProps) => {
  return (
    <DesktopIconButton onDoubleClick={onClick}>
      <DesktopIconImage src={icons[type]} />
      <DesltopIconText>{label}</DesltopIconText>
    </DesktopIconButton>
  );
};

const Desktop = () => {
  const { openProcess } = useActivity();

  return (
    <DesktopRoot>
      {apps.map((app) => (
        <DesktopIcon
          type={app.type}
          label={app.name}
          onClick={() => openProcess(app.type)}
          key={app.type}
        />
      ))}
    </DesktopRoot>
  );
};

export default Desktop;
