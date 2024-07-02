import { DocumentNode, LazyQueryHookOptions, LazyQueryResultTuple, OperationVariables, TypedDocumentNode } from "@apollo/client";
declare const useTrackedLazyQuery: <TData, TVariables extends OperationVariables = OperationVariables>(query: DocumentNode | TypedDocumentNode<TData, TVariables>, options?: LazyQueryHookOptions<NoInfer<TData>, NoInfer<TVariables>> | undefined) => LazyQueryResultTuple<TData, TVariables>;
export default useTrackedLazyQuery;
//# sourceMappingURL=useTrackedLazyQuery.d.ts.map