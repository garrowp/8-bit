import * as React from "react";
import { useAppState } from "../hooks";

function withStateSlice(Comp, slice) {
  const MemoComp = React.memo(Comp);

  function Wrapper(props, ref) {
    const state = useAppState();
    const slicedState = slice(state, props);
    return <MemoComp ref={ref} state={slicedState} {...props} />;
  }
  Wrapper.displayName = `withstateSlice${Comp.displayName || Comp.name}`;
  return React.memo(React.forwardRef(Wrapper));
}

export { withStateSlice };
