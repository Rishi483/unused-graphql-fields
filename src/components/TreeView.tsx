import React, { useState } from "react";
import { keys, keysSize } from "../lib/state";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import Modal from "./Modal";
import { prefixForKey } from "../utils/prefixForKey";

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

const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
};

function getSizeOfPrefixedKey(targetKey: string): number {
  return keysSize().get(targetKey)?.size || 0;
}

function getUnusedSum(tempSize: TempSize[], targetKey: string): number {
  return tempSize?.find((item) => item.key === targetKey)?.sum || 0;
}

function isUnused(targetKey: string): boolean {
  const item = keys().get(targetKey);
  return item ? !item.used : false;
}

const buildPath = (currentPath: string, key: string): string => {
  return currentPath ? prefixForKey(currentPath, key) : key;
};

const getStackTrace = (targetKey: string): string[] => {
  const stackTrace = keys().get(targetKey)?.stackTrace;
  return stackTrace ? stackTrace : [];
};

const TreeView: React.FC<TreeNodeProps> = ({
  data,
  title,
  tempSize,
  isRoot = false,
  path,
  onDelete,
  rootSize = -1,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  rootSize = rootSize === -1 ? getSizeOfPrefixedKey(path) : rootSize;
  const curPathSize = getSizeOfPrefixedKey(path);
  const unusedPercentage =
    curPathSize === 0
      ? 0
      : ((getUnusedSum(tempSize, path) / curPathSize) * 100).toFixed(2);
  const unUsedFlag = curPathSize === 0 ? true : isUnused(path);
  const areChildsPresent = Object.keys(data).length > 0;
  const stackTrace = !path.includes(".") ? getStackTrace(path) : [];

  const handleDelete = () => {
    if (stackTrace.length > 0) {
      onDelete(path);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div
      style={{
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        fontSize: "14px",
        color: "#333",
        marginLeft: "20px",
        lineHeight: "1.5",
        padding: "4px",
        margin: "5px 0",
        backgroundColor: isRoot ? "#F1F8FF" : "#FFFFFF",
        borderLeft: isRoot ? "5px solid #2196F3" : "3px solid #BBDEFB",
        paddingLeft: isRoot ? "8px" : "12px",
        borderRadius: "4px",
        minHeight: "25px",
      }}
    >
      {!isRoot && (
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            cursor: "pointer",
            color: unUsedFlag ? "#9E9E9E" : "#424242",
            display: "flex",
            alignItems: "center",
            backgroundColor: "#E3F2FD",
            padding: "6px 8px",
            borderRadius: "6px",
            transition: "background-color 0.3s ease",
          }}
        >
          <span style={{ marginRight: "4px" }}>
            {areChildsPresent ? (
              expanded ? (
                <FaChevronDown />
              ) : (
                <FaChevronRight />
              )
            ) : (
              ""
            )}
          </span>
          <span style={{ fontWeight: "bold", flex: 1 }}>
            {title}
            <span
              style={{
                marginLeft: "8px",
                fontSize: "12px",
                color: unUsedFlag ? "#9E9E9E" : "#616161",
              }}
            >
              ({unusedPercentage}% unused of {formatBytes(curPathSize)})
            </span>
          </span>
          {stackTrace.length > 0 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal();
                }}
                style={{
                  marginLeft: "12px",
                  padding: "2px 4px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  backgroundColor: "#4CAF50",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                View StackTrace
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                style={{
                  marginLeft: "12px",
                  padding: "2px 4px",
                  fontSize: "12px",
                  color: "#FFFFFF",
                  backgroundColor: "#f44336",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </>
          )}
        </div>
      )}
      {(areChildsPresent && expanded) || isRoot ? (
        <ul
          style={{
            listStyleType: "none",
            paddingLeft: "12px",
            marginTop: "1px",
          }}
        >
          {Object.keys(data).map((key) => {
            const fullPath = buildPath(path, key);
            return (
              <li key={key} style={{ marginTop: "4px" }}>
                <TreeView
                  data={data[key]}
                  tempSize={tempSize}
                  title={key}
                  path={fullPath}
                  rootSize={rootSize}
                  onDelete={() => {}}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        contentLabel="Stack Trace"
      >
        <div
          style={{
            fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "12px",
            lineHeight: "1.2",
            color: "#333",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            height: "400px",
            overflow: "scroll",
          }}
        >
          {stackTrace.map((trace, index) => (
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                background: "#e0f7fa",
                border: "1px solid #007bff",
                padding: "10px",
                margin: "5px",
                borderRadius: "5px",
                position: "relative",
              }}
              key={index}
            >
              {trace}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default TreeView;
