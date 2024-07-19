import React, { useState } from 'react'
import useFetch from '../hooks/useFetch'
import { VideoItem } from '../components/video/VideoItem';
import { CiCirclePlus } from "react-icons/ci";
import { VideoAddModal } from '../components/video/VideoAddModal';

const Video = () => {
  const urlValue = "http://localhost:3000/video/videoData.json";
  const {data, loading, error } = useFetch(urlValue);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const videos = data?.videoDatas ?? [];
  
  return (
    <div id='main' role='main'>
      <div id='video-container2' role='video-container2'>
        {
          videos.map((video) => (
            <div id="video-container3" key={video.id}>
              <VideoItem video={video} />
              
              <div id="video-title">              
                <span>
                  {video.title}
                </span>
              </div>
            </div>          
          ))
        }
        <div id="video-add-container3" role="video-container3" onClick={openModal}>          
            <CiCirclePlus size={50}/>          
        </div>
        <VideoAddModal modalIsOpen={modalIsOpen} closeModal={closeModal} url={url} setUrl={setUrl} title={title} setTitle={setTitle} description={description} setDescription={setDescription}/>                  
      </div>      
    </div>      
  );
}

export default Video
