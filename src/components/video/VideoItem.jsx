import React from "react";
import { useNavigate } from "react-router-dom";

// onClick 했을 때 해당 라우터로 리다이렉트

export const VideoItem = ({ video }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/videos/${video.id}`);
    }

    return(
    <div id="video-item" role="video-item" onClick={handleClick}>        
        <p>{video.description}</p>
        <img src={video.thumbnail} alt={`${video.title} thumbnail`} />
    </div>
    );
}