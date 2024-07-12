import React, { useEffect, useState } from "react";
import TreeView from "./TreeView";
import { keys as keysVar, keysSize as keysSizeVar } from "../lib/state";
import { prefixForKey } from "../utils/prefixForKey";
import { ContextKeyMapType, KeySizeMapType } from "../lib/state";
import { clearAllEntries } from "../utils/clearAllEntries";

interface TempSize {
  key: string;
  sum: number;
}

interface Node {
  children: { [key: string]: Node };
  used?: boolean;
  sum?: number;
}

interface TreeViewRendererProps {
  showClearAllButton?: boolean;
}

const TreeViewRenderer: React.FC<TreeViewRendererProps> = ({
  showClearAllButton,
}) => {
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
    }, 100);
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
  const [hoverState, setHoverState] = useState(false);
  return (
    <div style={{ width: "100%", maxHeight: "600px" }}>
      {showClearAllButton && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearAllEntries();
          }}
          style={{
            color: hoverState ? "red" : "black",
            border: `1px solid ${hoverState ? "red" : "gray"}`,
            padding: "7px 13px",
            borderRadius: "4px",
            fontSize: "14px",
            cursor: "pointer",
            margin: "6px 0",
            backgroundColor: "#fff",
            transition: "all 0.3s ease",
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
          }}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
        >
          Clear All
        </button>
      )}

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
