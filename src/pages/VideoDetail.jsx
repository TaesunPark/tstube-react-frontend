import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useState, useEffect } from "react";


const VideoDetail = () => {
    const [videoDetails, setVideoDetails] = useState(null);
    const { videoID } = useParams();
    const url = "http://localhost:3000/video/videoDetailData.json"
    // const url = "`http://localhost:3000/video/${videoID}`"
    const {data, loading, error} = useFetch(url);
    let videoData;

    useEffect(() => {
        if (data && videoID) {
            videoData = data?.videoDetailDatas?.[videoID];
            setVideoDetails(videoData);
        }
    }, [data, videoID]);
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading video details.</div>;
    if (!videoDetails) return <div>No video details available.</div>;

    return(
        <>
            <div id="main-video">
            <iframe width="560" height="315" src={videoDetails.src} title={videoDetails.title} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                <h1>제목</h1>
                <p id="video-description">설명</p>
                <p>조회수</p>
            </div>
        </>
    )
}

export default VideoDetail;