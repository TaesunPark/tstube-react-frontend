import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { fileUploadStore } from "../../stores/FileUploadStore";
import ReusableFileUpload from "./ReusableFileUpload"; // 재사용 가능한 컴포넌트 임포트
import videoStore from "../../stores/VideoStore";

const FileUploadModal = observer(({ onClose }) => {
  const [file, setFile] = useState(null); // 업로드할 비디오 파일
  const [title, setTitle] = useState(""); // 제목
  const [error, setError] = useState(""); // 에러 메시지
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 파일

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const validVideoTypes = ["video/mp4", "audio/mpeg", "audio/ogg", "audio/wav"];
      if (!validVideoTypes.includes(selectedFile.type)) {
        setError("Only video files (mp4, mp3, ogg, wav) are allowed.");
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

    // 비디오 파일 업로드
    fileUploadStore.uploadFile(file, title).then((videoId) => {
      // 썸네일 업로드
      if (thumbnail) {
        fileUploadStore.uploadImageFile(thumbnail, videoId).then((data) => {
          const newVideo = {
            title,
            thumbnailUrl: data
          }
          videoStore.setAddVideo(newVideo);
        })
      }
    });

    onClose(); // 모달 닫기
  };

  return (
    <div id="modal">
      <div id="modal-content">
        <h3>Upload File (audio & video) <br /> (mp4, mp3, ogg, wav)</h3>

        {/* 제목 입력 */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter file title"
          />
        </div>

        {/* 비디오 파일 업로드 */}
        <div>
          <label>File:</label>
          <input
            type="file"
            accept="video/mp4,audio/mpeg,audio/ogg,audio/wav"
            onChange={handleFileChange}
          />
        </div>

        {/* 썸네일 업로드 */}
        <ReusableFileUpload
          label="Upload Thumbnail"
          setThumbnail={setThumbnail} // 부모 컴포넌트로 썸네일 전달
        />

        {/* 에러 메시지 */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 버튼 */}
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