import { SourceType } from "../types/SourceType";
   
export function prefixForKey(source: SourceType,postFix?:SourceType): SourceType {
    return source + "."+(postFix?postFix:"");
}