import {keys,keysSize} from "../lib/state"

export const clearAllEntries = () => {
    keys(new Map());
    keysSize(new Map());
  };