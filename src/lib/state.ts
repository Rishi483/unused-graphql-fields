import { makeVar } from '@apollo/client';
import { KeySizeType } from '../types/ContextType';
import { ContextKeyType } from '../types/ContextKeyType';

export type ContextKeyMapType = Map<string, ContextKeyType>;
export type KeySizeMapType = Map<string, KeySizeType>;

export const keys = makeVar<ContextKeyMapType>(new Map());
export const keysSize = makeVar<KeySizeMapType>(new Map());
  