import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import colors from "../lib/colors";
import FlexSpacer from "./FlexSpacer";

const WindowsButtonRoot = styled.button`
  height: 100%;
  border: none;
  background-color: transparent;
  outline: none;
  user-select: none;

  &:hover {
    background-color: ${colors.taskbarIconActive};
  }
`;

const WindowsButtonImage = styled.img`
  height: 100%;
  padding: 0.5rem;
`;

type WindowsButtonProps = {
  onClick: () => void;
  selected: boolean;
};

const WindowsButton = forwardRef<HTMLButtonElement, WindowsButtonProps>(
  ({ onClick, selected }, buttonRef) => {
    return (
      <WindowsButtonRoot
        onClick={onClick}
        ref={buttonRef}
        style={{
          backgroundColor: selected ? colors.taskbarIconActive : undefined,
        }}
      >
        <WindowsButtonImage src="/icons/w10.png" />
      </WindowsButtonRoot>
    );
  }
);

const StartupMenuSettingsRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 5dvh;
  height: 100%;
`;

const StartupMenuSettingsButtonRoot = styled.button`
  width: 100%;
  aspect-ratio: 1/1;
  background-color: transparent;
  border: 1px solid transparent;

  &:hover {
    background-color: #6b6b6b7e;
  }

  &:active {
    background-color: #9b9b9b7c;
  }
`;

const StartupMenuSettingsButtonImage = styled.img`
  width: 100%;
  padding: 0.5rem;
`;

type StartupMenuSettingsButtonProps = {
  src: string;
  invert?: boolean;
  onClick?: () => void;
};

const StartupMenuSettingsButton = ({
  src,
  onClick,
  invert,
}: StartupMenuSettingsButtonProps) => {
  return (
    <StartupMenuSettingsButtonRoot onClick={onClick}>
      <StartupMenuSettingsButtonImage
        src={src}
        style={{ filter: invert ? "invert(100%)" : undefined }}
      />
    </StartupMenuSettingsButtonRoot>
  );
};

const StartupMenuSettings = () => {
  return (
    <StartupMenuSettingsRoot>
      <StartupMenuSettingsButton src="/icons/startup/hamburguer.png" invert />
      <FlexSpacer />
      <StartupMenuSettingsButton src="/icons/pfp.png" />
      <StartupMenuSettingsButton src="/icons/startup/file.png" invert />
      <StartupMenuSettingsButton src="/icons/startup/image.png" invert />
      <StartupMenuSettingsButton src="/icons/startup/settings.png" invert />
      <StartupMenuSettingsButton src="/icons/startup/power.png" invert />
    </StartupMenuSettingsRoot>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(200%);
  }
  to {
    transform: translateY(0%);
  }
`;

const slideDown = keyframes`
  from {
    transform: translateY(0%);
  }
  to {
    transform: translateY(200%);
  }
`;

type StartupMenuRootProps = {
  show: boolean;
};

const StartupMenuRoot = styled.div<StartupMenuRootProps>`
  background-color: rgba(0, 0, 0, 0.75);
  height: 65dvh;
  width: 30vw;

  position: absolute;
  bottom: 4dvh;
  left: 0;
  z-index: -1;
  backdrop-filter: blur(5px);

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  animation: ${({ show }) => (show ? slideUp : slideDown)} 0.2s ease-in;
  transform: ${({ show }) => (show ? "translateY(0%)" : "translateY(200%)")};
`;

const StartupMenu = () => {
  const startupMenuRef = useRef<HTMLDivElement | null>(null);
  const windowsButtonRef = useRef<HTMLButtonElement | null>(null);
  const [showStartupMenu, setShowStartupMenu] = useState(false);

  const toggleStartupMenu = () => {
    setShowStartupMenu((prev) => !prev);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      startupMenuRef.current &&
      !startupMenuRef.current.contains(event.target as Node) &&
      !windowsButtonRef.current?.contains(event.target as Node)
    ) {
      setShowStartupMenu(false);
    }
  }, []);

  useEffect(() => {
    if (showStartupMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showStartupMenu, handleClickOutside]);

  return (
    <>
      <WindowsButton
        onClick={toggleStartupMenu}
        ref={windowsButtonRef}
        selected={showStartupMenu}
      />
      <StartupMenuRoot ref={startupMenuRef} show={showStartupMenu}>
        <StartupMenuSettings />
      </StartupMenuRoot>
    </>
  );
};

export default StartupMenu;
