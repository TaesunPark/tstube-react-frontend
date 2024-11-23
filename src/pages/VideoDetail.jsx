import { useParams, useSearchParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";
import videoStore from "../stores/VideoStore";
import { observer } from "mobx-react";


const VideoDetail = observer(() => {
    const [searchParams] = useSearchParams();
    const videoID = searchParams.get('v');
    const {video, loading, error} = videoStore;
    
    useEffect(() => {
        videoStore.getVideo(videoID);
    }, [videoID]);
    
    if (loading) return <div>Loading...</div>;
    if (!video) return <div>No video details available.</div>;

    return(
        <>
            <div id="main-video">            
                <VideoComponent video={video}/>
                <h1>제목</h1>
                <p id="video-description">설명</p>
                <p>조회수</p>
            </div>
        </>
    )
});

function VideoComponent({video}) {
    return (
        <div
            dangerouslySetInnerHTML={{__html: video.src}}
        />
    )
}

export default VideoDetail;