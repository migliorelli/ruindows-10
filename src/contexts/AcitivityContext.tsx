import { createContext, PropsWithChildren, useContext, useState } from "react";

export type Process = {
  id: number;
  type: number;
  zIndex: number;
  minimized: boolean;
};

type AcitivityContext = {
  processes: Process[];
  killProcess: (id: number) => void;
  bringToFront: (id: number) => void;
  openProcess: (id: number) => void;
  minimizeProcess: (id: number) => void;
};

const acitivityContext = createContext({} as AcitivityContext);

const AcitivityProvider = ({ children }: PropsWithChildren) => {
  const [processes, setProcesses] = useState<Process[]>([]);

  const killProcess = (id: number) => {
    setProcesses((prevProcesses) =>
      prevProcesses.filter((process) => process.id !== id)
    );
  };

  const openProcess = (type: number) => {
    const highestZIndex =
      processes.length > 0 ? Math.max(...processes.map((p) => p.zIndex)) : 0;

    setProcesses((prevProcesses) => [
      ...prevProcesses,
      { id: Date.now(), type, zIndex: highestZIndex + 1, minimized: false },
    ]);
  };

  const bringToFront = (id: number) => {
    setProcesses((prevProcesses) => {
      const highestZIndex = Math.max(...prevProcesses.map((p) => p.zIndex));
      return prevProcesses.map((process) =>
        process.id === id ? { ...process, zIndex: highestZIndex + 1 } : process
      );
    });
  };

  const minimizeProcess = (id: number) => {
    setProcesses((prevProcesses) => {
      return prevProcesses.map((process) => {
        if (process.id === id) {
          if (process.minimized) {
            bringToFront(id);
          }
          return { ...process, minimized: !process.minimized };
        } else return process;
      });
    });
  };

  return (
    <acitivityContext.Provider
      value={{
        processes,
        bringToFront,
        killProcess,
        minimizeProcess,
        openProcess,
      }}
    >
      {children}
    </acitivityContext.Provider>
  );
};

export default AcitivityProvider;

export const useActivity = () => useContext(acitivityContext);
