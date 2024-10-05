import {
  MouseEvent as ReactMouseEvent,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import useLayoutDimensions from "../../hooks/use-layout-dimensions";
import styled, { keyframes } from "styled-components";
import WindowMenu from "./Menu";
import { useActivity } from "../../contexts/AcitivityContext";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
`;

type Position = {
  x: number;
  y: number;
};

type Size = {
  width: number;
  height: number;
};

type WindowFrameProps = {
  minimized: boolean;
};

const WindowFrame = styled.div<WindowFrameProps>`
  position: absolute;
  display: flex;
  flex-direction: column;

  background-color: white;
  box-shadow: -5px 5px 15px -7px rgba(0, 0, 0, 0.5);

  transition: opacity 0.3s ease, transform 0.3s ease;
  animation: ${({ minimized }) => (minimized ? fadeOut : fadeIn)} 0.3s forwards;

  opacity: ${({ minimized }) => (minimized ? 0 : 1)};
  transform: ${({ minimized }) => (minimized ? "scale(0.9)" : "scale(1)")};
`;

const WindowContent = styled.div`
  flex: 1;
`;

export type WindowProps = PropsWithChildren<{
  zIndex: number;
  minimized: boolean;
  title?: string;
  id: number;
  type: number;
}>;

const Window = ({
  children,
  zIndex,
  title = "Window",
  id,
  minimized,
  type,
}: WindowProps) => {
  const { bringToFront, killProcess, minimizeProcess } = useActivity();
  const layout = useLayoutDimensions();

  const defaultPosition = {
    x: layout.width * 0.25,
    y: layout.height * 0.1,
  };
  const defaultSize = {
    width: layout.width * 0.5,
    height: layout.height * 0.7,
  };

  const maximizedPosition = { x: 0, y: 0 };
  const maximizedSize = { width: layout.width, height: layout.height * 0.95 };

  const [position, setPosition] = useState<Position>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState<Position | null>(null);

  const [size, setSize] = useState<Size>(defaultSize);

  const onMaximize = () => {
    if (
      position.x === maximizedPosition.x &&
      position.y === maximizedPosition.y &&
      size.width === maximizedSize.width &&
      size.height === maximizedSize.height
    ) {
      setPosition(defaultPosition);
      setSize(defaultSize);
    } else {
      setPosition(maximizedPosition);
      setSize(maximizedSize);
    }
  };

  const onDragStart = (event: ReactMouseEvent) => {
    setIsDragging(true);
    setStartPosition({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isDragging || !startPosition) return;

      const x = event.clientX - startPosition.x;
      const y = event.clientY - startPosition.y;

      setPosition({ x, y });
    },
    [isDragging, startPosition]
  );

  // Adicionando os eventos de mouse
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", onDragEnd);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, [isDragging, handleMouseMove]);

  const onMouseDown = () => {
    bringToFront(id);
  };

  const onMinimize = () => {
    minimizeProcess(id);
  };

  const onClose = () => {
    killProcess(id);
  };

  return (
    <WindowFrame
      minimized={minimized}
      onMouseDown={onMouseDown}
      style={{
        top: position.y,
        left: position.x,
        width: size.width,
        height: size.height,
        zIndex,
      }}
    >
      <WindowMenu
        type={type}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        title={title}
        onMaximize={onMaximize}
        onMinimize={onMinimize}
        onClose={onClose}
      />
      <WindowContent>{children}</WindowContent>
    </WindowFrame>
  );
};

export default Window;
