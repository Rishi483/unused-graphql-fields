import { SourceType } from "../types/SourceType";
import { getCallingTrace } from "../utils/commonUtils";
import { getSourceFromQuery } from "../utils/getSourceFromQuery";
import {
  DocumentNode,
  OperationVariables,
  TypedDocumentNode,
} from "@apollo/client";
import { getHash } from "../utils/commonUtils";
import { useId, useMemo } from "react";
import useProxyData from "./useProxyData";

const useTrackedData = function <TData, TVariables extends OperationVariables>(
  data: TData,
  query: DocumentNode | TypedDocumentNode<TData, TVariables>
) {
  const id = useId();

  let source: SourceType = useMemo(() => getSourceFromQuery(query), [query]);

  const stackTrace = useMemo(() => getCallingTrace(), []);

  const uniqueIdentifier = useMemo(() => {
    return process.env.NODE_ENV === "development"
      ? getHash(stackTrace)
      : id;
  }, [stackTrace, id]);

  let updatedSource = source + "_" + uniqueIdentifier;

  const proxyData: TData | undefined = useProxyData<TData>({
    data,
    updatedSource,
    stackTrace,
  });

  return proxyData;
};

export default useTrackedData;
