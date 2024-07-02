import { ContextKeyType } from "./ContextKeyType";
import { MutableRefObject } from 'react';

export type KeySizeType = {
  key: string;
  size: number;
};

export interface ContextType {
  keys: MutableRefObject<ContextKeyType[]>;
  keysSize: MutableRefObject<KeySizeType[]>;  
}