import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type GatekeeperContextType = {
  isUnlocked: boolean;
  unlock: () => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const GatekeeperContext = createContext<GatekeeperContextType | null>(null);

export const useGatekeeper = () => {
  const ctx = useContext(GatekeeperContext);
  if (!ctx) throw new Error("useGatekeeper must be inside GatekeeperProvider");
  return ctx;
};

export const GatekeeperProvider = ({ children }: { children: ReactNode }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const unlock = useCallback(() => setIsUnlocked(true), []);
  const openModal = useCallback(() => setShowModal(true), []);
  const closeModal = useCallback(() => setShowModal(false), []);

  return (
    <GatekeeperContext.Provider value={{ isUnlocked, unlock, showModal, openModal, closeModal }}>
      {children}
    </GatekeeperContext.Provider>
  );
};
