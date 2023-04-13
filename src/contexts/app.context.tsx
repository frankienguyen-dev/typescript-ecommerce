import React, { createContext, useState } from "react";
import { ExtendedPurchase } from "src/types/purchase.type";
import { User } from "src/types/user.type";
import {
  getAccessTokenFromLocalStorage,
  getProfileFromLocalStorage,
} from "src/utils/auth";

interface AppContextInterface {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  profile: User | null;
  setProfile: React.Dispatch<React.SetStateAction<User | null>>;
  extendedPurchase: ExtendedPurchase[];
  setExtendedPurchase: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>;
  reset: () => void;
}

const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  extendedPurchase: [],
  setExtendedPurchase: () => null,
  reset: () => null,
};

export const AppContext = createContext<AppContextInterface>(initialAppContext);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialAppContext.isAuthenticated
  );

  const [extendedPurchase, setExtendedPurchase] = useState<ExtendedPurchase[]>(
    initialAppContext.extendedPurchase
  );

  const [profile, setProfile] = useState<User | null>(
    initialAppContext.profile
  );

  const reset = () => {
    setIsAuthenticated(false), setExtendedPurchase([]), setProfile(null);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        extendedPurchase,
        setExtendedPurchase,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
