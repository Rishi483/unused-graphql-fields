import React, { useState } from "react";
import { VscDebugAlt } from "react-icons/vsc";
import { MdOutlineClose } from "react-icons/md";
import TreeViewRenderer from "./TreeViewRenderer";

const UnusedFieldsViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);
  const closeExpansion = () => setIsExpanded(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        width: "auto",
        minWidth: isExpanded ? "400px" : "0",
        maxHeight: "80vh",
        padding: "15px 15px 7px 15px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        overflow: "scroll",
        transition: "all 0.1s ease",
        zIndex: 100,
        color: "black",
      }}
      onClick={isExpanded ? undefined : toggleExpansion}
    >
      {isExpanded ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <MdOutlineClose
              fontSize={"20px"}
              cursor={"pointer"}
              onClick={closeExpansion}
            />
          </div>
          <TreeViewRenderer />
        </div>
      ) : (
        <span style={{ fontSize: "24px" }}>
          <VscDebugAlt />
        </span>
      )}
    </div>
  );
};

export default UnusedFieldsViewer;
