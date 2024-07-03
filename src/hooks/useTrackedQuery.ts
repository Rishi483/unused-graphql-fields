import {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from "@apollo/client";
import useTrackedData from "./useTrackedData";

const useTrackedQuery = function <
  TData,
  TVariables extends OperationVariables = OperationVariables
>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
): QueryResult<TData, TVariables> {
  const result = useQuery<TData, TVariables>(query, options);

  const { data } = result;

  const proxyData: TData | undefined = useTrackedData<TData, TVariables>(
    data as TData,
    query
  );

  return { ...result, data: proxyData as TData };
};

export default useTrackedQuery;
