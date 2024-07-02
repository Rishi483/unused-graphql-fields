import { ContextKeyType } from "../types/ContextKeyType";
import { KeySizeType } from "../types/ContextType";
import { SourceType } from "../types/SourceType";
import { ReactiveVar } from "@apollo/client";
interface ApolloDataType {
    [key: string]: any;
}
interface transformToGettersPropsType {
    jsonData: ApolloDataType;
    keys: ReactiveVar<ContextKeyType[]>;
    source: SourceType;
    keysSize: ReactiveVar<KeySizeType[]>;
    prefix?: SourceType;
}
export declare function transformToGetters({ jsonData, keys, source, keysSize, prefix, }: transformToGettersPropsType): Object;
export {};
//# sourceMappingURL=transformToGetters.d.ts.map