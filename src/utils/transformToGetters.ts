import { SourceType } from "../types/SourceType";
import { prefixForKey } from "./prefixForKey";
import { ContextKeyMapType, KeySizeMapType } from "../lib/state";
import { ReactiveVar } from "@apollo/client";

const onKeyUsed = (keyName: string, keys: ReactiveVar<ContextKeyMapType>) => {
  const updatedKeys = new Map(keys());
  const item = updatedKeys.get(keyName);
  if (!item) return updatedKeys;
  updatedKeys.delete(keyName);
  item.used = true;
  updatedKeys.set(keyName, item);
  return updatedKeys;
};

function storeSizeInKeysSize(
  obj: any,
  prefix: string,
  keysSize: ReactiveVar<KeySizeMapType>
): number {
  let cumulativeSize = 0;

  Object.keys(obj).forEach((key, index, array) => {
    const value = obj[key];
    const prefixedKey = prefixForKey(prefix, key);

    let size = jsonSize(key);

    if (typeof value === "object" && value !== null) {
      if (Array.isArray(value)) {
        let arrayItemsSize = 0;
        value.forEach((item, itemIndex) => {
          if (typeof item === "object" && item !== null) {
            arrayItemsSize += storeSizeInKeysSize(item, prefixedKey, keysSize);
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

    if (keysSize().has(prefixedKey)) {
      const existingSize = keysSize().get(prefixedKey)!.size;
      keysSize().set(prefixedKey, {
        key: prefixedKey,
        size: existingSize + size,
      });
    } else {
      keysSize().set(prefixedKey, { key: prefixedKey, size });
    }
    cumulativeSize += size;
  });
  if (!prefix.includes(".")) {
    if (keysSize().has(prefix)) {
      const existingSize = keysSize().get(prefix)!.size;
      keysSize().set(prefix, {
        key: prefix,
        size: existingSize + cumulativeSize,
      });
    } else {
      keysSize().set(prefix, { key: prefix, size: cumulativeSize });
    }
  }
  return cumulativeSize;
}

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

export function transformToGetters({
  jsonData,
  keys,
  source,
  keysSize,
  prefix,
}: TransformToGettersPropsType): any {
  if (prefix === undefined) {
    prefix = prefixForKey(source);
    storeSizeInKeysSize(jsonData, source, keysSize);
  }

  const result: any = {};
  const processValue = (key: string, value: any, currentPrefix: string) => {
    const prefixedKey = `${currentPrefix}${key}`;
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === "object" && item !== null
          ? transformToGetters({
              jsonData: item,
              keys,
              source,
              keysSize,
              prefix: prefixForKey(prefixedKey),
            })
          : item
      );
    } else if (typeof value === "object" && value !== null) {
      return transformToGetters({
        jsonData: value,
        keys,
        source,
        keysSize,
        prefix: prefixForKey(prefixedKey),
      });
    }
    return value;
  };

  Object.keys(jsonData).forEach((key) => {
    const value = jsonData[key];
    const updatedValue = processValue(key, value, prefix);
    Object.defineProperty(result, key, {
      get: () => {
        keys(onKeyUsed(`${prefix}${key}`, keys));
        return updatedValue;
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
