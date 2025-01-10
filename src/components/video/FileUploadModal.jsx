import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { fileUploadStore } from "../../stores/FileUploadStore";

const FileUploadModal = observer(({ onClose }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validVideoTypes = ["video/mp4", "audio/mpeg", "audio/ogg", "audio/wav"];
      if (!validVideoTypes.includes(selectedFile.type)) {
        setError("Only video files (mp4, avi, mov, mkv) are allowed.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(""); // 에러 초기화
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUpload = () => {
    if (!file) {
      setError("Please select a video file.");
      return;
    }
    if (!title) {
      setError("Please enter a title.");
      return;
    }
    fileUploadStore.uploadFile(file, title);
    onClose(); // 모달을 닫고 업로드 진행
  };

  return (
    <div id="modal">
      <div id="modal-content">
        <h3>Upload File (audio & video) <br /> (mp4, mp3, ogg, wav)</h3>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter file title"
          />
        </div>
        <div>
          <label>File:</label>
          <input
            type="file"
            accept="video/mp4,audio/mpeg,audio/ogg,audio/wav"
            onChange={handleFileChange}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <button onClick={handleUpload} disabled={fileUploadStore.isUploading}>
            {fileUploadStore.isUploading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
});

export default FileUploadModal;