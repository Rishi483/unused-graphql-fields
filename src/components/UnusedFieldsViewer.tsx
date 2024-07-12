import React, { useState } from "react";
import { VscDebugAlt } from "react-icons/vsc";
import { MdOutlineClose } from "react-icons/md";
import TreeViewRenderer from "./TreeViewRenderer";

const UnusedFieldsViewer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpansion = () => setIsExpanded(!isExpanded);

  return (
    <>
      <div
        style={{
          display: isExpanded ? "flex" : "none",
          justifyContent: "center",
          position: "fixed",
          bottom: "20px",
          right: "78px",
          backgroundColor: "white",
          padding: "15px 20px",
          zIndex: 100,
          borderRadius: "5px",
          maxHeight: "600px",
          minHeight: "100px",
          overflow: "scroll",
          transition: "all 0.3s ease",
          width: "600px",
        }}
      >
        <TreeViewRenderer showClearAllButton={true} />
      </div>
      <div
        style={{
          position: "fixed",
          cursor: "pointer",
          bottom: "20px",
          right: "20px",
          width: "auto",
          minWidth: "50px",
          maxHeight: "80vh",
          padding: "15px 15px 7px 15px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          overflow: "scroll",
          transition: "all 0.3s ease",
          zIndex: 100,
          color: "black",
        }}
        onClick={toggleExpansion}
      >
        <span
          style={{
            fontSize: isExpanded ? 0 : "24px",
            transition: "all 0.3s ease",
            opacity: isExpanded ? 0 : 1,
          }}
        >
          <VscDebugAlt />
        </span>
        <span
          style={{
            fontSize: !isExpanded ? 0 : "24px",
            transition: "all 0.3s ease",
            opacity: isExpanded ? 1 : 0,
          }}
        >
          <MdOutlineClose />
        </span>
      </div>
    </>
  );
};

export default UnusedFieldsViewer;
