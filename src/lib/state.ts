import { makeVar } from '@apollo/client';
import { KeySizeType } from '../types/ContextType';
import { ContextKeyType } from '../types/ContextKeyType';

export const keys = makeVar<ContextKeyType[]>([]);
export const keysSize = makeVar<KeySizeType[]>([]);
  