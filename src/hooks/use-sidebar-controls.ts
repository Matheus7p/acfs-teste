import { useState, useCallback } from "react";

interface IUseSidebarControlsReturn {
  isOpen: boolean;
  toggle: () => undefined;
  close: () => undefined;
}

export const useSidebarControls = (): IUseSidebarControlsReturn => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggle = useCallback((): undefined => {
    setIsOpen((prev) => !prev);
    return undefined;
  }, []);

  const close = useCallback((): undefined => {
    setIsOpen(false);
    return undefined;
  }, []);

  return { isOpen, toggle, close };
};
