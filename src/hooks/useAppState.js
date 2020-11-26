import * as React from "react";
import { AppStateContext } from "../context/AppProvider";

function useAppState() {
  const context = React.useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within the AppProvider");
  }
  return context;
}

export { useAppState };
