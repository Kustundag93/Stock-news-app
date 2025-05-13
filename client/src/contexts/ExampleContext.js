import { createContext, useContext, useState } from 'react';

const ExampleContext = createContext();

export const useExampleContext = () => useContext(ExampleContext);

export const ExampleProvider = ({ children }) => {
  const [state, setState] = useState(null);
  return (
    <ExampleContext.Provider value={{ state, setState }}>
      {children}
    </ExampleContext.Provider>
  );
}; 