import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { fileUploadStore } from "../../stores/FileUploadStore";
import FileUploadModal from "./FileUploadModal";

const FloatingButton = observer(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const closeModal = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  return (
    <div>
      <button
        id="floatingButton"
        onClick={handleButtonClick}
        disabled={fileUploadStore.isUploading}
      >
        {fileUploadStore.isUploading ? "Uploading..." : "+"}
      </button>

      {/* 모달이 열리면 나타나게 */}
      {isModalOpen && <FileUploadModal onClose={closeModal} />}
    </div>
  );
});

export default FloatingButton;
