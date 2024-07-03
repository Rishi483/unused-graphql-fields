import { SourceType } from "../types/SourceType";
import { ContextKeyMapType, KeySizeMapType } from "../lib/state";
import { ReactiveVar } from "@apollo/client";
interface ApolloDataType {
    [key: string]: any;
}
interface TransformToGettersPropsType {
    jsonData: ApolloDataType;
    keys: ReactiveVar<ContextKeyMapType>;
    source: SourceType;
    keysSize: ReactiveVar<KeySizeMapType>;
    prefix?: SourceType;
}
export declare function transformToGetters({ jsonData, keys, source, keysSize, prefix, }: TransformToGettersPropsType): any;
export {};
//# sourceMappingURL=transformToGetters.d.ts.map