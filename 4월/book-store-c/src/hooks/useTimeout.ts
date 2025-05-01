import { useEffect } from 'react';

const useTimeout = (callback: () => void, delay: number) => {
  useEffect(() => {
    const timer = setTimeout(callback, delay);

    return () => clearTimeout(timer);
  }, []);
};

export default useTimeout;