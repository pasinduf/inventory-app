import { createContext, useEffect, useState } from 'react';

const AppContext = createContext({});

export const AppProvider = ({ children }: any) => {
  const [store, setStore] = useState(() => {
    const savedStore = localStorage.getItem('appStore');
    return savedStore
      ? JSON.parse(savedStore)
      : {
          categories: [],
          suppliers: [],
        };
  });

  useEffect(() => {
    localStorage.setItem('appStore', JSON.stringify(store));
  }, [store]);

  return (
    <AppContext.Provider value={{ store, setStore }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
