import { MouseEvent } from "react";
import styled from "styled-components";
import FlexSpacer from "../FlexSpacer";
import { icons } from "../../lib/util";

const MenuButton = styled.button`
  height: 100%;
  aspect-ratio: 1/1;
  background-color: transparent;
  border: none;
  user-select: none;
  outline: none;

  &:hover {
    background-color: lightgray;
  }
`;

const MenuTitle = styled.div`
  padding-inline: 0.5rem;
  user-select: none;
  font-size: small;
`;

const WindowMenuContainer = styled.div`
  height: 2rem;
  cursor: grab;

  display: flex;
  align-items: center;
  justify-content: flex-start;
`;

const MenuIcon = styled.img`
  height: 100%;
  aspect-ratio: 1/1;
  padding: 0.5rem;
`;

type WindowMenuProps = {
  onDragStart: (event: MouseEvent) => void;
  onDragEnd: (event: MouseEvent) => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  title: string;
  type: number;
};

const WindowMenu = ({
  onDragStart,
  onDragEnd,
  onClose,
  onMinimize,
  onMaximize,
  title,
  type,
}: WindowMenuProps) => {
  return (
    <WindowMenuContainer onMouseDown={onDragStart} onMouseUp={onDragEnd}>
      <MenuIcon src={icons[type]} />
      <MenuTitle>{title}</MenuTitle>
      <FlexSpacer />
      <MenuButton onClick={onMinimize}>–</MenuButton>
      <MenuButton onClick={onMaximize}>▢</MenuButton>
      <MenuButton onClick={onClose}>⨉</MenuButton>
    </WindowMenuContainer>
  );
};

export default WindowMenu;
