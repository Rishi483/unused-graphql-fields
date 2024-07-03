import { ContextKeyType } from "../types/ContextKeyType";
import {prefixForKey} from "./prefixForKey"
  
export function getAllUniqueKeys(obj:any, source:string,prefix?:string, keySet = new Set<ContextKeyType>()):Set<ContextKeyType>{ 

  if(prefix===undefined){
    keySet.add({key:source,source,used:true,stackTrace:[]});
    prefix=prefixForKey(source);
  }

  for (let key in obj) {
    keySet.add({ key: `${prefix}${key}`, source, used: false,stackTrace:[] });
    if (typeof obj[key] === 'object') {
      if (Array.isArray(obj[key]) && obj[key].length > 0 && typeof obj[key][0] === 'object') {
        getAllUniqueKeys(obj[key][0], source, `${prefix}${key}.`,keySet);
      } else if (!Array.isArray(obj[key])) {
        getAllUniqueKeys(obj[key], source, `${prefix}${key}.`,keySet);
      }
    }
  }
  return keySet;
};
