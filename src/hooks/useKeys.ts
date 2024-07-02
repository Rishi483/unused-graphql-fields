import { keys, keysSize } from "../lib/state"

const result = { keys, keysSize };

export const useKeys = () => {
  return result;
};  
