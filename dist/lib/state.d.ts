import { KeySizeType } from '../types/ContextType';
import { ContextKeyType } from '../types/ContextKeyType';
export type ContextKeyMapType = Map<string, ContextKeyType>;
export type KeySizeMapType = Map<string, KeySizeType>;
export declare const keys: import("@apollo/client").ReactiveVar<ContextKeyMapType>;
export declare const keysSize: import("@apollo/client").ReactiveVar<KeySizeMapType>;
//# sourceMappingURL=state.d.ts.map