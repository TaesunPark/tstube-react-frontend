import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import ReusableFileUpload from './ReusableFileUpload';
import { useAuth } from '../../provisers/AuthProvider'
import { useNavigate } from 'react-router-dom';

const ModalStyle = {
  overlay: {
    backgroundColor: 'rgba(1, 0, 0, 0.75)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
}

// 진행률 표시 컴포넌트 스타일
const progressBarStyle = {
  container: {
    width: '100%',
    marginTop: '10px',
    marginBottom: '15px',
  },
  bar: {
    height: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#4285f4',
    borderRadius: '5px',
    transition: 'width 0.3s ease',
  },
  text: {
    fontSize: '12px',
    textAlign: 'center',
    marginTop: '5px',
    color: '#666',
  }
};

export const VideoAddModal = ({ 
  modalIsOpen, 
  closeModal, 
  handleConfirmClick, 
  url, 
  setUrl, 
  title, 
  setTitle, 
  description, 
  setDescription, 
  thumbnail, 
  setThumbnail, 
  preview, 
  setPreview,
  uploadProgress = 0,
  isUploading = false 
}) => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // 로그인 상태 확인
  useEffect(() => {
    if (modalIsOpen && !auth.isAuthenticated) {
      setError('비디오 추가는 로그인이 필요합니다.');
    } else {
      setError('');
    }
  }, [modalIsOpen, auth.isAuthenticated]);

  // 확인 버튼 핸들러 - 인증 체크 추가
  const handleConfirm = () => {
    if (!auth.isAuthenticated) {
      setError('로그인이 필요합니다.');
      return;
    }
    
    // 입력 유효성 검사
    if (!url.trim() && !thumbnail) {
      setError('URL 또는 iframe 태그를 입력하거나 비디오 파일을 업로드해주세요.');
      return;
    }
    
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    handleConfirmClick();
  };

  // 로그인 페이지로 이동
  const goToLogin = () => {
    closeModal();
    window.location.href = 'https://tsbute.shop/auth/login/kakao'
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={ModalStyle}
    >
      <h2 id='video-modal-h2'>Add New Video</h2>
      
      {!auth.isAuthenticated && (
        <div style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>
          <p>{error}</p>
          <button 
            onClick={goToLogin}
            style={{ 
              padding: '8px 12px', 
              backgroundColor: '#4285f4', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            로그인 하러 가기
          </button>
        </div>
      )}
      
      {error && auth.isAuthenticated && (
        <div style={{ color: 'red', marginBottom: '10px' }}>
          <p>{error}</p>
        </div>
      )}
      
      <div id='video-modal-box'>        
        <textarea 
          id='video-modal-textarea'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="iframe 태그 또는 url 정보를 넣어주세요."
          disabled={!auth.isAuthenticated || isUploading}
        />
      </div>
      
      <div id='video-modal-box'>        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          id='video-modal-input'
          disabled={!auth.isAuthenticated || isUploading}
        />
      </div>
      
      <div id='video-modal-box'>        
        <textarea 
          id='video-modal-textarea'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          disabled={!auth.isAuthenticated || isUploading}
        />
      </div>
      
      {/* 썸네일 업로드 */}
      <ReusableFileUpload
        label="Upload Thumbnail"
        setThumbnail={setThumbnail}
        disabled={!auth.isAuthenticated || isUploading}
      />
      
      {/* 업로드 진행률 표시 */}
      {isUploading && (
        <div style={progressBarStyle.container}>
          <div style={progressBarStyle.bar}>
            <div 
              style={{
                ...progressBarStyle.fill,
                width: `${uploadProgress}%`
              }} 
            />
          </div>
          <div style={progressBarStyle.text}>
            {uploadProgress}% 업로드됨
          </div>
        </div>
      )}
      
      <div>
        <button
          onClick={closeModal}
          id='video-modal-button'
          disabled={isUploading}
        >
          Close
        </button>
        <button
          onClick={handleConfirm}
          id='video-modal-button'
          disabled={!auth.isAuthenticated || isUploading}
        >
          {isUploading ? '업로드 중...' : '확인'}
        </button>
      </div>
    </Modal>
  );
};