
import { useToasts } from "react-toast-notifications";
import { useAppDispatch } from "./index";

function useUndoRedo() {
  const dispatch = useAppDispatch();

  const { addToast } = useToasts();

  const undo = (history) => {
    if (history.length > 1) {
      dispatch({ type: "UNDO" });
      addToast("Action undone", {
        appearance: "info",
        autoDismiss: true,
      });
    }
  }

  function redo(redoHistory) {
    if (redoHistory.length > 0) {
      dispatch({ type: "REDO" });
      addToast("Action redone", {
        appearance: "info",
        autoDismiss: true,
      });
    }
  }

  return { undo, redo };
}

export { useUndoRedo };
