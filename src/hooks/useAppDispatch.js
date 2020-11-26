import * as React from "react";
import { AppDispatchContext } from "../context/AppProvider";

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext);
  if (!context) {
    throw new Error("useAppDispatch must be used within the AppProvider");
  }
  return context;
}

export { useAppDispatch };
