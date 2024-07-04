import { SourceType } from "../types/SourceType";
import { getAllUniqueKeys } from "../utils/getAllUniqueKeys";
import { transformToGetters } from "../utils/transformToGetters";
import { useMemo } from "react";
import { keys, keysSize } from "../lib/state";

interface PropsType<TData> {
  data: TData;
  updatedSource: SourceType;
  stackTrace: string[];
}

const useProxyData = function <TData>({
  data,
  updatedSource,
  stackTrace,
}: PropsType<TData>): TData {
  const proxyData = useMemo(() => {
    if (!data) return undefined;

    const updatedKeys = new Map(keys());
    updatedKeys.forEach((item, key) => {
      if (item.source === updatedSource) {
        updatedKeys.delete(key);
      }
    });

    const updatedKeysSize = new Map(keysSize());
    updatedKeysSize.forEach((item, key) => {
      if (key.startsWith(updatedSource)) {
        updatedKeysSize.delete(key);
      }
    });

    getAllUniqueKeys(data, updatedSource).forEach((item) => {
      updatedKeys.set(item.key, item);
    });

    updatedKeys.forEach((item, key) => {
      if (item.source === updatedSource) {
        updatedKeys.set(key, {
          ...item,
          stackTrace,
        });
      }
    });

    keys(updatedKeys);
    keysSize(updatedKeysSize);
    return transformToGetters({
      jsonData: data,
      keys,
      source: updatedSource,
      keysSize,
    });
  }, [data, updatedSource]);

  return proxyData as TData;
};

export default useProxyData;
