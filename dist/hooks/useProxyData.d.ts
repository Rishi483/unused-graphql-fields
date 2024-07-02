import { SourceType } from "../types/SourceType";
interface PropsType<TData> {
    data: TData;
    updatedSource: SourceType;
    stackTrace: string[];
}
declare const useProxyData: <TData>({ data, updatedSource, stackTrace, }: PropsType<TData>) => TData;
export default useProxyData;
//# sourceMappingURL=useProxyData.d.ts.map