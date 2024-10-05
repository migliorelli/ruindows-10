import {
  Children,
  cloneElement,
  MouseEvent as ReactMouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import styled from "styled-components";
import colors from "../../lib/colors";

const NotepadMenuRoot = styled.div`
  width: 100%;
  border-bottom: 1px lightgray solid;

  display: flex;
  justify-content: flex-start;
`;

const NotepadOptionRoot = styled.div`
  position: relative;
`;

const NotepadOptionButton = styled.button`
  background-color: white;
  outline: none;
  border: none;
  font-size: smaller;
  border: 1px transparent solid;

  &:hover {
    background-color: ${colors.buttonSelection};
    border: 1px solid ${colors.buttonSelectionBorder};
  }
`;

type FloatingMenuProps = {
  show: boolean;
};

const FloatingMenu = styled.div<FloatingMenuProps>`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #f2f2f2;
  box-shadow: 3px 3px 3px 0px rgba(0, 0, 0, 0.3);
  z-index: 9999999;
  display: ${(props) => (props.show ? "flex" : "none")};
  min-width: 300px;
  user-select: none;

  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 0.25rem;
`;

const FloatingMenuDivider = styled.div`
  height: 1px;
  background-color: lightgray;
  margin-left: 1.75rem;
  margin-block: 0.25rem;
  width: calc(100% - 1.75rem);
`;

const FloatingMenuOptionButton = styled.button`
  width: 100%;
  border: none;
  margin: 0;
  background-color: transparent;
  text-align: start;
  padding-left: 2rem;
  font-size: 0.75rem;
  padding-block: 0.25rem;
  user-select: none;

  &:hover {
    background-color: ${colors.buttonSelectionBorder};
  }
`;

type FloatingMenuOptionProps = PropsWithChildren<{
  onClick?: MouseEventHandler<HTMLButtonElement>;
  closeMenu?: () => void;
}>;

const FloatingMenuOption = ({
  children,
  onClick = () => {},
  closeMenu = () => {},
}: FloatingMenuOptionProps) => {
  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    onClick(event);
    closeMenu();
  };

  return (
    <FloatingMenuOptionButton onClick={handleClick}>
      {children}
    </FloatingMenuOptionButton>
  );
};

type NotepadOptionProps = PropsWithChildren<{ label: string }>;

const NotepadOption = ({ label, children }: NotepadOptionProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  }, []);

  const handleEsc = (event: KeyboardEvent) => {
    if (event.key == "Escape") {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showMenu, handleClickOutside]);

  return (
    <NotepadOptionRoot ref={menuRef}>
      <NotepadOptionButton onClick={toggleMenu}>{label}</NotepadOptionButton>
      <FloatingMenu show={showMenu}>
        {children &&
          Children.map(children, (child) =>
            cloneElement(child as React.ReactElement, {
              closeMenu: () => setShowMenu(false),
            })
          )}
      </FloatingMenu>
    </NotepadOptionRoot>
  );
};

type NotepadHeaderProps = {
  onClose: () => void;
  onSave: () => void;
  onSaveAs: () => void;
  onUndo: () => void;
  onNewWindow: () => void;
  onNew: () => void;
  onCopy: () => void;
  onOpen: () => void;
  onCut: () => void;
  onDelete: () => void;
  onPaste: () => void;
  onIncreaseZoom: () => void;
  onReduceZoom: () => void;
  onResetZoom: () => void;
  onToggleStatusBar: () => void;
  showStatusBar: boolean;
};

const NotepadHeader = ({
  onUndo,
  onCopy,
  onCut,
  onDelete,
  onNew,
  onPaste,
  onIncreaseZoom,
  onSaveAs,
  onClose,
  onOpen,
  onReduceZoom,
  onResetZoom,
  onNewWindow,
  onToggleStatusBar,
  showStatusBar,
  onSave,
}: NotepadHeaderProps) => {
  const onGithub = () => {
    window.open("https://github.com/migliorelli");
  };

  return (
    <NotepadMenuRoot>
      <NotepadOption label="Files">
        <FloatingMenuOption onClick={onNew}>New</FloatingMenuOption>
        <FloatingMenuOption onClick={onNewWindow}>
          New window
        </FloatingMenuOption>
        <FloatingMenuOption onClick={onOpen}>Open...</FloatingMenuOption>
        <FloatingMenuOption onClick={onSave}>Save</FloatingMenuOption>
        <FloatingMenuOption onClick={onSaveAs}>Save as...</FloatingMenuOption>
        <FloatingMenuDivider />
        <FloatingMenuOption onClick={onClose}>Exit</FloatingMenuOption>
      </NotepadOption>
      <NotepadOption label="Edit">
        <FloatingMenuOption onClick={onUndo}>Undo</FloatingMenuOption>
        <FloatingMenuDivider />
        <FloatingMenuOption onClick={onCut}>Cut</FloatingMenuOption>
        <FloatingMenuOption onClick={onCopy}>Copy</FloatingMenuOption>
        <FloatingMenuOption onClick={onPaste}>Paste</FloatingMenuOption>
        <FloatingMenuOption onClick={onDelete}>Delete</FloatingMenuOption>
        <FloatingMenuDivider />
        <FloatingMenuOption>Find</FloatingMenuOption>
        <FloatingMenuDivider />
        <FloatingMenuOption>Select all</FloatingMenuOption>
      </NotepadOption>
      <NotepadOption label="Show">
        <FloatingMenuOption onClick={onIncreaseZoom}>
          Increase zoom
        </FloatingMenuOption>
        <FloatingMenuOption onClick={onReduceZoom}>
          Reduce zoom
        </FloatingMenuOption>
        <FloatingMenuOption onClick={onResetZoom}>
          Default zoom
        </FloatingMenuOption>
        <FloatingMenuDivider />
        <FloatingMenuOption onClick={onToggleStatusBar}>
          {showStatusBar && "✔"} Status bar
        </FloatingMenuOption>
      </NotepadOption>
      <NotepadOption label="Help">
        <FloatingMenuOption onClick={onGithub}>Github</FloatingMenuOption>
      </NotepadOption>
    </NotepadMenuRoot>
  );
};

export default NotepadHeader;
