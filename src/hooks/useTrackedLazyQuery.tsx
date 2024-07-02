import {
  DocumentNode,
  LazyQueryHookOptions,
  LazyQueryResultTuple,
  OperationVariables,
  TypedDocumentNode,
  useLazyQuery,
} from "@apollo/client";
import useTrackedData from "./useTrackedData";

const useTrackedLazyQuery = function <
  TData,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?:
    | LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>>
    | undefined
): LazyQueryResultTuple<TData, TVariables> {
  const [getQuery, result] = useLazyQuery(query, options);

  const { data } = result;

  const proxyData = useTrackedData(data as TData, query);

  return [getQuery, { ...result, data: proxyData as TData }];
};

export default useTrackedLazyQuery;
