import React, { useState } from "react";
import { keys, keysSize } from "../lib/state";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import { MdDeleteOutline, MdInfoOutline } from "react-icons/md";
import { GoStack } from "react-icons/go";
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

  const [hoverState, setHoverState] = useState(false);

  return (
    <div
      style={{
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
        fontSize: "14px",
        margin: "0.5rem 0",
        color: "black",
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
            border: `1px solid ${hoverState ? "black" : "gray"}`,
            padding: "6px 8px",
            borderRadius: "5px",
            transition: "all 0.5s ease",
          }}
          onMouseEnter={() => setHoverState(true)}
          onMouseLeave={() => setHoverState(false)}
        >
          <span style={{ marginRight: "4px", marginTop: "4px" }}>
            {areChildsPresent ? (
              expanded ? (
                <FaChevronDown style={{ marginTop: "3px" }} />
              ) : (
                <FaChevronRight />
              )
            ) : (
              ""
            )}
          </span>
          <span style={{ fontWeight: "bold", flex: 1,maxWidth:"80%",overflow:"scroll"}}>
            {title}{" "}
            <span style={{ fontWeight: "normal" }}>
              ({unusedPercentage}% unused of {formatBytes(curPathSize)})
            </span>
          </span>
          {stackTrace.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginLeft: "10px",
              }}
            >
              <GoStack
                onClick={(e) => {
                  e.stopPropagation();
                  openModal();
                }}
                fontSize="1.4rem"
                style={{ color: "black" }}
              />
              <MdDeleteOutline
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                fontSize="1.5rem"
              />
            </div>
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
            fontFamily: "system-ui, Tahoma, Geneva, Verdana, sans-serif",
            fontSize: "14px",
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
                overflow:"scroll",
                width:"100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid gray",
                padding: "10px",
                margin: "4px",
                borderRadius: "3px",
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
