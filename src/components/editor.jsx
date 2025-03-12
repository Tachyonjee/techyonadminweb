import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import katex from "katex";

window.katex = katex;

const Editor = ({ label, value, onChange, placeholder = "Write something...", height }) => {
  const [editorValue, setEditorValue] = useState(value || "");

  const handleEditorChange = (html) => {
    setEditorValue(html);
    onChange(html);
  };

  return (
    <div className="editor-container" style={{ height: "220px",marginTop:"10px",marginBottom:"10px" }}>
      {label && <label className="block text-gray-700 font-semibold mb-2">{label}</label>}
      <ReactQuill
        theme="snow"
        value={editorValue}
        onChange={handleEditorChange}
        modules={Editor.modules}
        formats={Editor.formats}
        placeholder={placeholder}
        style={{ height: "150px" }}
      />
    </div>
  );
};

// Quill Editor Modules (Toolbar Customization)
Editor.modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }],
    [{ header: [1, 2, 3, false] }],
    ["link", "image", "formula"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
};

// Quill Supported Formats
Editor.formats = [
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "script",
  "header",
  "link",
  "image",
  "formula",
  "color",
  "background",
  "align",
];

export default Editor;