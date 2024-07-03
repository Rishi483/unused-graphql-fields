import { SourceType } from "../types/SourceType";
   
export function getSourceFromQuery(query:any):SourceType{
    return query.definitions[0].name.value;
}