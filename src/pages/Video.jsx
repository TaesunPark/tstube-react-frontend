import React, { useEffect, useState } from 'react';
import { VideoItem } from '../components/video/VideoItem';
import { CiCirclePlus } from 'react-icons/ci';
import { VideoAddModal } from '../components/video/VideoAddModal';
import videoStore from '../stores/VideoStore';
import { observer } from 'mobx-react';

const Video = observer(() => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
  };

  // 비디오 추가 로직
  const handleConfirmClick = () => {
    const newVideo = {
      title,
      src: url,
      description,
      thumbnail: 'https://i.ytimg.com/vi/K9vJUXHn80I/maxresdefault.jpg', // Placeholder thumbnail
      cnt: 0,
      channelTitle: title,
    };

    videoStore.addVideo(newVideo);
    closeModal();
  };

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
        />
      </div>
    </div>
  );
});
export default Video;
