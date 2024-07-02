import { ContextKeyType } from "../types/ContextKeyType";
import { SourceType } from "../types/SourceType";
import { getAllUniqueKeys } from "../utils/getAllUniqueKeys";
import { transformToGetters } from "../utils/transformToGetters";
import { ReactiveVar } from "@apollo/client";
import { useMemo } from "react";
import { useKeys } from "./useKeys";

const addStackTraceInKeys = (
  keys: ReactiveVar<ContextKeyType[]>,
  stackTrace: string[],
  source: SourceType
) => {
  return keys().map((item) => {
    if (item.key === source) {
      return {
        ...item,
        used: true,
        stackTrace,
      };
    }
    return item;
  });
};
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
  const { keys, keysSize } = useKeys();

  const proxyData = useMemo(() => {
    if (!data) return undefined;
    const newKeysObjects = Array.from(getAllUniqueKeys(data, updatedSource));
    const updatedKeys = keys().filter(
      (item) => !(item.source === updatedSource)
    );
    const updatedKeysSize = keysSize().filter(
      (item) => !item.key.startsWith(updatedSource)
    );
    keysSize(updatedKeysSize);
    keys([...updatedKeys, ...newKeysObjects]);
    keys(addStackTraceInKeys(keys, stackTrace, updatedSource));

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
