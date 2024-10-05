import Desktop from "../components/Desktop";
import Taskbar from "../components/Taskbar";
import Windows from "../components/Windows";
import AcitivityProvider from "../contexts/AcitivityContext";

const AppRoute = () => {
  return (
    <AcitivityProvider>
      <Windows />
      <Desktop />
      <Taskbar />
    </AcitivityProvider>
  );
};

export default AppRoute;
