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

export const VideoAddModal = ({ modalIsOpen, closeModal, handleConfirmClick, url, setUrl, title, setTitle, description, setDescription, thumbnail, setThumbnail, preview, setPreview  }) => {
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
    if (!url.trim()) {
      setError('URL 또는 iframe 태그를 입력해주세요.');
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
          disabled={!auth.isAuthenticated}
        />
      </div>
      
      <div id='video-modal-box'>        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          id='video-modal-input'
          disabled={!auth.isAuthenticated}
        />
      </div>
      
      <div id='video-modal-box'>        
        <textarea 
          id='video-modal-textarea'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"
          disabled={!auth.isAuthenticated}
        />
      </div>
      
      {/* 썸네일 업로드 */}
      <ReusableFileUpload
        label="Upload Thumbnail"
        setThumbnail={setThumbnail}
        disabled={!auth.isAuthenticated}
      />
      
      <div>
        <button
          onClick={closeModal}
          id='video-modal-button'
        >
          Close
        </button>
        <button
          onClick={handleConfirm}
          id='video-modal-button'
          disabled={!auth.isAuthenticated}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};