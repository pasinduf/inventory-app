import AppContext from '@/context/AppContext';
import { useContext } from 'react';

export const useAppStore = () => {
  return useContext(AppContext);
};
