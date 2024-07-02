import { ContextKeyType } from "../types/ContextKeyType";
import { KeySizeType } from "../types/ContextType";
import { SourceType } from "../types/SourceType";
import { prefixForKey } from "./prefixForKey";
import { ReactiveVar } from "@apollo/client";

const storeKeySize = (
  keyName: string,
  size: number,
  keysSize: ReactiveVar<KeySizeType[]>
) => {
  const isAlreadyPresent = keysSize().find((item) => item.key === keyName);
  const newKeysSize: KeySizeType[] = keysSize().map((item) => {
    if (item.key === keyName) return { ...item, size: item.size + size };
    return item;
  });
  if (!isAlreadyPresent) {
    newKeysSize.push({ key: keyName, size });
  }
  return newKeysSize;
};

const onKeyUsed = (
  keyName: ContextKeyType["key"],
  source: ContextKeyType["source"],
  keys: ReactiveVar<ContextKeyType[]>
) => {
  const updatedkeys = keys().map((k) => {
    if (k.key == keyName && k.source == source) return { ...k, used: true };
    return k;
  });
  return updatedkeys;
};

function storeSizeInKeysSize(
  obj: any,
  prefix: string,
  keysSize: ReactiveVar<KeySizeType[]>
): number {
  let cumulativeSize = 0;

  Object.keys(obj).forEach((key, index, array) => {
    const value = obj[key];
    const prefixedKey = `${prefix}.${key}`;

    let size = jsonSize(key);

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        let arrayItemsSize = 0;
        value.forEach((item, itemIndex) => {
          if (typeof item === "object" && item !== null) {
            arrayItemsSize += storeSizeInKeysSize(
              item,
              `${prefixedKey}`,
              keysSize
            );
          } else {
            arrayItemsSize += jsonSize(item);
          }
        });
        size += arrayItemsSize;
      } else {
        size += storeSizeInKeysSize(value, prefixedKey, keysSize);
      }
    } else {
      size += jsonSize(value);
    }

    const percentage = size;
    keysSize(storeKeySize(prefixedKey, percentage, keysSize));
    cumulativeSize += size;
  });
  if (!prefix.includes(".")) {
    keysSize(storeKeySize(prefix, cumulativeSize, keysSize));
  }
  return cumulativeSize;
}

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

export function transformToGetters({
  jsonData,
  keys,
  source,
  keysSize,
  prefix,
}: transformToGettersPropsType): Object {
  if (prefix === undefined) {
    prefix = prefixForKey(source);
    storeSizeInKeysSize(jsonData, source, keysSize);
  }
  const result = {};
  Object.keys(jsonData).forEach((key) => {
    const value = jsonData[key];
    const prefixedKey = `${prefix}${key}`;
    Object.defineProperty(result, key, {
      get: () => {
        keys(onKeyUsed(prefixedKey, source, keys));
        if (Array.isArray(value)) {
          return value.map((item) => {
            if (typeof item === "object" && item !== null) {
              return transformToGetters({
                jsonData: item,
                keys: keys,
                source: source,
                keysSize: keysSize,
                prefix: prefixForKey(prefixedKey),
              });
            }
            return item;
          });
        } else if (typeof value === "object" && value !== null) {
          return transformToGetters({
            jsonData: value,
            keys: keys,
            source: source,
            keysSize: keysSize,
            prefix: prefixForKey(prefixedKey),
          });
        }
        return value;
      },
      configurable: true,
      enumerable: true,
    });
  });
  return result;
}

function jsonSize(jsonData: any): number {
  return Buffer.byteLength(JSON.stringify(jsonData), "utf8");
}
