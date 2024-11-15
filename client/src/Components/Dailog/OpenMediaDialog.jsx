import { saveAs } from "file-saver";
import React from "react";

const OpenMediaDialog = ({ onClose, Media }) => {
  const { type, url } = Media;

  const handleDownload = () => {
    const fileName = url.split("/").pop();
    saveAs(url, fileName);
  };
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0
  bg-slate-950 bg-opacity-60 flex justify-center items-center z-20"
      onClick={() => onClose()}
    >
      <div
        className="max-w-lg bg-slate-950 bg-opacity-90 px-1 rounded-xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center gap-2 py-2 w-full">
          <button
            className="px-3 py-2 rounded shadow-sm outline-none bg-slate-900 text-white w-full"
            onClick={() => onClose()}
          >
            Close
          </button>
          <button
            className="px-3 py-2 rounded shadow-sm outline-none bg-slate-900 text-white w-full"
            onClick={handleDownload}
          >
            Download
          </button>
        </div>

        {type == "image" ? (
          <img
            src={url}
            alt="image"
            className="w-full max-h-[calc(100vh-200px)] rounded-lg object-contain"
            onClick={() => onClose()}
          />
        ) : (
          <video
            src={url}
            controls
            className="w-full max-h-[calc(100vh-200px)] rounded-lg object-contain"
            onClick={() => onClose()}
          ></video>
        )}
      </div>
    </div>
  );
};

export default OpenMediaDialog;
