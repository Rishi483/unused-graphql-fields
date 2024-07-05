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
  const [hoveredTooltip, setHoveredTooltip] = useState<boolean>(false);

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
            backgroundColor: "#E9F0FE",
            padding: "6px 8px",
            borderRadius: "5px",
            transition: "background-color 0.3s ease",
          }}
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
          <span style={{ fontWeight: "bold", flex: 1 }}>{title}</span>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
              margin: 0,
            }}
            onMouseEnter={() => setHoveredTooltip(true)}
            onMouseLeave={() => setHoveredTooltip(false)}
          >
            <MdInfoOutline
              fontSize="1.2rem"
              style={{ marginTop: "4px", color: "black" }}
            />
            <span
              style={{
                visibility: hoveredTooltip ? "visible" : "hidden",
                width: "200px",
                backgroundColor: "#eef0f1",
                color: "black",
                textAlign: "center",
                borderRadius: "6px",
                padding: "5px 10px",
                position: "absolute",
                zIndex: 1,
                bottom: "25%",
                right: "100%",
                marginLeft: "-80px",
                opacity: hoveredTooltip ? 1 : 0,
                transition: "opacity 0.3s",
                fontFamily:
                  "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji",
                fontSize: "12px",
                boxShadow: "0px 0px 6px rgba(0, 0, 0, 0.2)",
              }}
            >
              {unusedPercentage}% unused of {formatBytes(curPathSize)}
            </span>
          </div>
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
                fontSize="1.1rem"
                style={{ color: "black" }}
              />
              <MdDeleteOutline
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                fontSize="1.1rem"
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
                background: "#E9F0FE",
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
