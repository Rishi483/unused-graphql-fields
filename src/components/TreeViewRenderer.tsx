import React, { useEffect, useState } from "react";
import TreeView from "./TreeView";
import { useKeys } from "../hooks/useKeys";
import { prefixForKey } from "../utils/prefixForKey";
import { ContextKeyMapType, KeySizeMapType } from "../lib/state";

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
  const [keys, setKeys] = useState<ContextKeyMapType>(keysVar());
  const [keysSize, setKeysSize] = useState<KeySizeMapType>(keysSizeVar());
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

  const isUnused = (keys: ContextKeyMapType, targetKey: string): boolean => {
    const item = keys.get(targetKey);
    return item ? !item.used : false;
  };

  const getValue = (keysSize: KeySizeMapType, targetKey: string): number => {
    const item = keysSize.get(targetKey);
    return item ? item.size : 0;
  };

  const buildTree = (items: ContextKeyMapType): { [key: string]: Node } => {
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
    keysSize: KeySizeMapType,
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
    keysVar(new Map());
    keysSizeVar(new Map());
    setKeys(new Map());
    setKeysSize(new Map());
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
    keys.forEach((value, key) => {
      if (key.startsWith(id)) {
        keys.delete(key);
      }
    });
    keysVar(keys);

    keysSize.forEach((value, key) => {
      if (key.startsWith(id)) {
        keysSize.delete(key);
      }
    });
    keysSizeVar(keysSize);
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
