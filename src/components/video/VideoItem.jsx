import React from "react";
import { useNavigate } from "react-router-dom";
import { SERVER_URL } from "../../env";

// onClick 했을 때 해당 라우터로 리다이렉트

export const VideoItem = ({ video }) => {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate(`/video?v=${video.videoId}`);
    }

    return(
        <div id="video-item" onClick={handleClick}>                                
            <img src={SERVER_URL+"/upload?fileName="+video.thumbnailUrl} alt={`${video.title} thumbnail`} />
        </div>
    );
}