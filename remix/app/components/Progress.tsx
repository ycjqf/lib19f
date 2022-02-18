import { useTransition } from "remix";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef } from "react";

export default function Progress() {
  const transition = useTransition();
  const ref = useRef(null);

  useEffect(() => {
    // @ts-ignore
    if (transition.state === "idle") return ref.current.complete();
    // @ts-ignore
    ref.current.continuousStart();
  }, [transition]);

  return <LoadingBar color="#3178c6" ref={ref} height={2.5} transitionTime={50} />;
}
