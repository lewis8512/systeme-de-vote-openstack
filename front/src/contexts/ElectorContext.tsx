import { createContext, useContext, useState, useEffect } from "react";

export type Elector = {
  id: number;
  name: string;
  surname: string;
  email: string;
  hasVoted: boolean;
};

type ElectorContextType = {
  elector: Elector | null;
  setElector: (elector: Elector | null) => void;
};

const ElectorContext = createContext<ElectorContextType>({
  elector: null,
  setElector: () => {},
});

export const useElector = () => useContext(ElectorContext);

export const ElectorProvider = ({ children }: { children: React.ReactNode }) => {
  const [elector, setElector] = useState<Elector | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("elector");
    if (stored) {
      setElector(JSON.parse(stored));
    }
  }, []);

  return (
    <ElectorContext.Provider value={{ elector, setElector }}>
      {children}
    </ElectorContext.Provider>
  );
};
