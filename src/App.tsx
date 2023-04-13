import { useContext, useEffect } from "react";
import useRouteElement from "./routes/useRouteElement";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LocalStorageEventTarget } from "./utils/auth";
import { AppContext } from "./contexts/app.context";

function App() {
  const routeElements = useRouteElement();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener("clearLocalStorage", reset);
    return () => {
      LocalStorageEventTarget.removeEventListener("clearLocalStorage", reset);
    };
  }, [reset]);

  return (
    <div>
      {routeElements}
      <ToastContainer />
    </div>
  );
}

export default App;
