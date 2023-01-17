import { useState } from "react";

const getStorageValue = <T>(key: string, defaultValue: T): T => {
  // getting stored value
  const saved = localStorage.getItem(key);
  if (!saved) {
    return defaultValue;
  }
  try {
    const initial = JSON.parse(saved) as T;
    return initial || defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  const handleChange = (newValue: T) => {
    localStorage.setItem(key, JSON.stringify(newValue));
    return setValue(newValue);
  };

  // useEffect(() => {
  //   // storing input name
  //   localStorage.setItem(key, JSON.stringify(value));
  // }, [key, value]);

  return [value, handleChange];
};
