import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import videoStore from "../stores/VideoStore";
import { observer } from "mobx-react";
import { CommentStoreProvider } from "../stores/CommentStore";
import CommentComponent from "./Comment";
import CommentListComponent from "./CommentList";
import ChatComponent from "../components/chat/ChatComponent";
import { SERVER_URL } from "../env";

const VideoDetail = observer(() => {
    const [isChatVisible, setIsChatVisible] = useState(true);
    const toggleChatVisibility = () => setIsChatVisible((prev) => !prev);

    const videoContainerStyle = {
        width: isChatVisible ? "70%" : "100%",
    };

    const [searchParams] = useSearchParams();
    const videoID = searchParams.get('v');
    const { video, loading, error } = videoStore;

    useEffect(() => {
        videoStore.getVideo(videoID);
    }, []);

    if (loading) return <div>Loading...</div>;
    if (!video) return <div>No video details available.</div>;
    // 기본 값 설정
    if (video.title === null) video.title = "hi";
    if (video.description === null) video.description = "설명";
    if (video.cnt === null) video.cnt = 0;

    return (
        <>
            <div id="video-chat-container">
                <div id="main-video" style={videoContainerStyle}>                    
                    {video.type === "upload" ? (
                        <UploadVideoComponent video1={video} />
                    ) : (
                        <VideoComponent video={video} />
                    )}                    
                </div>
                <div>                    
                    <div id="chat-container" className={isChatVisible ? "" : "hidden"}>
                        <ChatComponent videoId={video.videoId} />
                    </div>
                </div>                
            </div>
            <h1>제목 : {video.title}</h1>
                    <p id="video-description">{video.description}</p>
                    <p>조회수 : {video.cnt}</p>
                    <button id="chat-toggle-button" onClick={toggleChatVisibility}>
                        {isChatVisible ? "채팅 숨기기" : "채팅 보기"}
                    </button>
            
            <div id="comment-container">
                <div id="comment-container2">
                    <CommentStoreProvider>
                        <CommentComponent />
                        <CommentListComponent />
                    </CommentStoreProvider>
                </div>             
            </div>
        </>
    );
});

function VideoComponent({ video }) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: video.src }}
        />
    );
}

function UploadVideoComponent({ video1 }) {
    console.log(video1.fileName + " 비디오");
    return (
        <video controls style={{ maxWidth: "100%", height: "auto"}}>
            <source 
                src={`${SERVER_URL}/upload?fileName=${video1.fileName}&t=${new Date().getTime()}`} 
                type="video/mp4" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video1.fileName}&t=${new Date().getTime()}`} 
                type="video/x-msvideo" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video1.fileName}&t=${new Date().getTime()}`} 
                type="audio/mpeg" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video1.fileName}&t=${new Date().getTime()}`} 
                type="audio/ogg" 
            />
            <source 
                src={`${SERVER_URL}/upload?fileName=${video1.fileName}&t=${new Date().getTime()}`} 
                type="audio/wav" 
            />
            Your browser does not support the video tag.
        </video>
    );
}

export default VideoDetail;
