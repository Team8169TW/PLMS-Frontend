import { useRef } from "react";

const useConstructor = (callback = () => {}) => {
  const hasBeenCalled = useRef(false);
  if (hasBeenCalled.current) return;
  callback();
  hasBeenCalled.current = true;
};

export default useConstructor;
