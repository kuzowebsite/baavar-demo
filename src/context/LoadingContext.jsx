import React, { createContext, useContext, useState } from 'react';

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Loading харуулаад, тодорхой хугацааны дараа үйлдэл хийх функц
  const triggerLoading = (callback, duration = 1500) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, duration);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, triggerLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => useContext(LoadingContext);