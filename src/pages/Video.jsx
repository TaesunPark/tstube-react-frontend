import React, { useEffect, useState } from 'react';
import { VideoItem } from '../components/video/VideoItem';
import { CiCirclePlus } from 'react-icons/ci';
import { VideoAddModal } from '../components/video/VideoAddModal';
import videoStore from '../stores/VideoStore';
import { fileUploadStore } from '../stores/FileUploadStore';
import { observer } from 'mobx-react';
import FloatingButton from '../components/video/FloatingButton';

const Video = observer(() => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [preview, setPreview] = useState(null); // 썸네일 미리보기 URL

  useEffect(() => {
    videoStore.fetchVideos();
  }, []);

  // 모달 열기
  const openModal = () => {
    setModalIsOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setModalIsOpen(false);
    setPreview(null);
    setThumbnail(null);
  };

  // 비디오 추가 로직
  const handleConfirmClick = () => {
    const newVideo = {
      title,
      src: url,
      description,
      thumbnailUrl: 'https://i.ytimg.com/vi/K9vJUXHn80I/maxresdefault.jpg', // Placeholder thumbnail
      cnt: 0,
      channelTitle: title,
      type: "iframe",
    };

    let videoId = null;
    videoStore.addVideo(newVideo)
        .then((response) => {          
          videoId = response.videoId;
          fileUploadStore.uploadImageFile(thumbnail, videoId).then((data) => {
            newVideo.thumbnailUrl = data;
            newVideo.videoId = videoId;
            videoStore.setAddVideo(newVideo);
          })          
        })
    
    closeModal();
  };

  const handleFloatingButtonClick = () => {

  }

  return (
    <div id="main" role="main">
      <div id="video-container2" role="video-container2">
        {videoStore.videos.map((video) => (
          <div id="video-container3" key={video.id}>
            <VideoItem video={video} />
            <div id="video-title">
              <span>{video.title}</span>
            </div>
          </div>
        ))}
        <div id="video-add-container3" role="video-container3" onClick={openModal}>
          <CiCirclePlus size={50} />
        </div>
        <VideoAddModal
          handleConfirmClick={handleConfirmClick}
          modalIsOpen={modalIsOpen}
          closeModal={closeModal}
          url={url}
          setUrl={setUrl}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          thumbnail={thumbnail}
          setThumbnail={setThumbnail}
          preview={preview}
          setPreview={setPreview}
        />
      </div>
      <FloatingButton/>
    </div>
  );
});
export default Video;
