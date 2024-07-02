import React from "react";
interface TempSize {
    key: string;
    sum: number;
}
interface TreeNodeProps {
    data: any;
    isRoot?: boolean;
    path: string;
    title: string;
    tempSize: TempSize[];
    onDelete: (id: string) => void;
    rootSize?: number;
}
declare const TreeView: React.FC<TreeNodeProps>;
export default TreeView;
//# sourceMappingURL=TreeView.d.ts.map