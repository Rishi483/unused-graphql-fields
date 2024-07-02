import React, { useEffect, useState } from "react";
import TreeView from "./TreeView";
import { ContextKeyType } from "../types/ContextKeyType";
import { useKeys } from "../hooks/useKeys";
import { KeySizeType } from "../types/ContextType";
import { prefixForKey } from "../utils/prefixForKey";

interface TempSize {
  key: string;
  sum: number;
}

interface Node {
  children: { [key: string]: Node };
  used?: boolean;
  sum?: number;
}

const TreeViewRenderer: React.FC = () => {
  const { keys: keysVar, keysSize: keysSizeVar } = useKeys();
  const [keys, setKeys] = useState<ContextKeyType[]>(keysVar());
  const [keysSize, setKeysSize] = useState<KeySizeType[]>(keysSizeVar());
  const [paths, setPaths] = useState<string[]>([]);
  const [tempSize, setTempSize] = useState<TempSize[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newKeys = keysVar();
      const newKeysSize = keysSizeVar();
      setKeys(newKeys);
      setKeysSize(newKeysSize);
    }, 2000);
    return () => clearInterval(interval);
  }, [keysVar, keysSizeVar]);

  useEffect(() => {
    const newPaths: string[] = [];
    keys.forEach((keyObject) => {
      if (!keyObject.used) {
        newPaths.push(keyObject.key);
      }
    });
    setPaths(newPaths);
  }, [keys]);

  const isUnused = (keys: ContextKeyType[], targetKey: string): boolean => {
    const item = keys.find((item) => item.key === targetKey);
    return item ? !item.used : false;
  };

  const getValue = (keysSize: KeySizeType[], targetKey: string): number => {
    return keysSize.find((item) => item.key === targetKey)?.size || 0;
  };

  const buildTree = (items: ContextKeyType[]): { [key: string]: Node } => {
    const roots: { [key: string]: Node } = {};

    items.forEach((item) => {
      const parts = item.key.split(".");
      let current = roots;

      parts.forEach((part, index) => {
        const fullPath = parts.slice(0, index + 1).join(".");
        if (!current[part]) {
          current[part] = { children: {}, used: !isUnused(items, fullPath) };
        }
        current = current[part].children;
      });
    });

    return roots;
  };

  const calculateSums = (
    node: Node,
    keysSize: KeySizeType[],
    path: string,
    tempSize: TempSize[] = []
  ): number => {
    let total = 0;

    Object.entries(node.children).forEach(([key, child]) => {
      const childPath = prefixForKey(path, key);
      const childSum = calculateSums(child, keysSize, childPath, tempSize);
      total += childSum;
    });

    if (node.used === false) {
      total = getValue(keysSize, path);
    }

    if (node.used !== undefined) {
      tempSize.push({ key: path, sum: total });
    }
    return total;
  };

  const transformToNestedObject = (paths: string[]): Record<string, any> => {
    const result: Record<string, any> = {};

    paths.forEach((path) => {
      const levels = path.split(".");
      let current: Record<string, any> = result;
      levels.forEach((level) => {
        if (!current[level]) {
          current[level] = {};
        }
        current = current[level];
      });
    });

    return result;
  };

  const clearAllEntries = () => {
    keysVar([]);
    keysSizeVar([]);
    setKeys([]);
    setKeysSize([]);
    setPaths([]);
    setTempSize([]);
  };

  const trees = buildTree(keys);
  const tempSizeList: TempSize[] = [];
  Object.keys(trees).forEach((rootKey) => {
    calculateSums(trees[rootKey], keysSize, rootKey, tempSizeList);
  });
  useEffect(() => {
    setTempSize(tempSizeList);
  }, [keys, keysSize]);

  const nestedObject = transformToNestedObject(paths);

  const handleDelete = (id: string) => {
    const updatedKeys = keys.filter((keyItem) => !keyItem.key.startsWith(id));
    keysVar(updatedKeys);
    const updatedKeysSize = keysSize.filter(
      (keySizeItem) => !keySizeItem.key.startsWith(id)
    );
    keysSizeVar(updatedKeysSize);
    const updatedPaths = paths.filter((path) => !path.startsWith(id));
    setPaths(updatedPaths);
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          padding: "5px 10px",
          fontSize: "13px",
          cursor: "pointer",
          borderRadius: "5px",
          marginBottom: "10px",
        }}
        onClick={(e) => {
          e.stopPropagation();
          clearAllEntries();
        }}
      >
        Clear
      </button>
      {Object.keys(nestedObject).map((item) => (
        <TreeView
          key={item}
          onDelete={handleDelete}
          tempSize={tempSize}
          title={item.split("_")[0]}
          path={item}
          data={nestedObject[item]}
        />
      ))}
    </div>
  );
};

export default TreeViewRenderer;
