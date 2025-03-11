import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { fileUploadStore } from "../../stores/FileUploadStore";
import ReusableFileUpload from "./ReusableFileUpload"; // 재사용 가능한 컴포넌트 임포트
import videoStore from "../../stores/VideoStore";
import { useAuth } from "../../provisers/AuthProvider";
import { useNavigate } from "react-router-dom";

const FileUploadModal = observer(({ onClose }) => {
  const [file, setFile] = useState(null); // 업로드할 비디오 파일
  const [title, setTitle] = useState(""); // 제목
  const [error, setError] = useState(""); // 에러 메시지
  const [thumbnail, setThumbnail] = useState(null); // 썸네일 파일

  const auth = useAuth();
  const navigate = useNavigate();

  // 로그인 상태 확인
  useEffect(() => {
    if (!auth.isAuthenticated) {
      setError("로그인이 필요한 기능입니다.")
    }
  }, [auth.isAuthenticated])

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

    if(!auth.isAuthenticated) {
      setError("로그인이 필요한 기능입니다.");
      return;
    }

    if (!file) {
      setError("Please select a video file.");
      return;
    }
    if (!title) {
      setError("Please enter a title.");
      return;
    }

    // 비디오 파일 업로드
    fileUploadStore.uploadFile(file, title, auth).then((response => {
      // 썸네일 업로드
      if (thumbnail) {
        fileUploadStore.uploadImageFile(thumbnail, response, auth).then((data) => {
          const newVideo = {
            title,
            thumbnailUrl: data,
            videoId: response,
          }
          videoStore.setAddVideo(newVideo);
        })
        .catch(error => {
          console.error("Upload error:", error);
          if (error.response && error.response.status === 401) {
            setError("로그인이 필요하거나 세션이 만료되었습니다.");
          } else {
            setError("업로드 중 오류가 발생했습니다.");
          }
        })
      }
    }));

    onClose(); // 모달 닫기
  };

  return (
    <div id="modal">
      <div id="modal-content">
        <h3>Upload File (audio & video) <br /> (mp4, mp3, ogg, wav)</h3>
        {/* 로그인 상태 표시 */}
        {!auth.isAuthenticated && (
          <div>
            <p>비디오 업로드는 로그인이 필요합니다.</p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
            >
              로그인 페이지로 이동
            </button>
          </div>
        )}
        {/* 제목 입력 */}
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Enter file title"
            disabled={!auth.isAuthenticated}
          />
        </div>

        {/* 비디오 파일 업로드 */}
        <div>
          <label>File:</label>
          <input
            type="file"
            accept="video/mp4,audio/mpeg,audio/ogg,audio/wav"
            onChange={handleFileChange}
            disabled={!auth.isAuthenticated}
          />
        </div>

        {/* 썸네일 업로드 */}
        <ReusableFileUpload
          label="Upload Thumbnail"
          setThumbnail={setThumbnail} // 부모 컴포넌트로 썸네일 전달
          disabled={!auth.isAuthenticated}
        />

        {/* 에러 메시지 */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* 버튼 */}
        <div>
          <button onClick={handleUpload} disabled={fileUploadStore.isUploading || !auth.isAuthenticated}>
            {fileUploadStore.isUploading ? "Uploading..." : "Upload"}
          </button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
});

export default FileUploadModal;