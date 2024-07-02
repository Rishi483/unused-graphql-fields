import { DocumentNode, OperationVariables, QueryHookOptions, QueryResult, TypedDocumentNode } from "@apollo/client";
declare const useTrackedQuery: <TData, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: QueryHookOptions<TData, TVariables>) => QueryResult<TData, TVariables>;
export default useTrackedQuery;
//# sourceMappingURL=useTrackedQuery.d.ts.map