import React from 'react';
import Modal from 'react-modal';

const ModalStyle = {
  overlay : {
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
  }
}

export const VideoAddModal = ({ modalIsOpen, closeModal, url, setUrl, title, setTitle, description, setDescription }) => {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Example Modal"
      style={ModalStyle}
    >
      <h2 id='video-modal-h2'>Add New Video</h2>
      <div id = 'video-modal-box'>        
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          id='video-modal-input'        
        />
      </div>
      <div id = 'video-modal-box'>        
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Title"
          id='video-modal-input'
        />
      </div>
      <div id = 'video-modal-box'>        
        <textarea id = 'video-modal-textarea'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter Description"          
        />
      </div>
      <div>
        <button
          onClick={closeModal}
          id='video-modal-button'
        >
          Close
        </button>
        <button
          onClick={closeModal}
          id='video-modal-button'
        >
          확인
        </button>
      </div>
    </Modal>
  );
};
