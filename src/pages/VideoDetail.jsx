import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import videoStore from "../stores/VideoStore";
import { observer } from "mobx-react";
import { CommentStoreProvider } from "../stores/CommentStore";
import CommentComponent from "./Comment";
import CommentListComponent from "./CommentList";
import ChatComponent from "../components/chat/ChatComponent";
import { VideoRenderer } from "../components/video/VideoRenderer";

const VideoDetail = observer(() => {
    const [isChatVisible, setIsChatVisible] = useState(true);
    const toggleChatVisibility = () => setIsChatVisible((prev) => !prev);

    const videoContainerStyle = {
        width: isChatVisible ? "70%" : "100%",
    };

    const [searchParams] = useSearchParams();
    const videoID = searchParams.get('v');
    const { video, loading, toggleFavorite } = videoStore;

    useEffect(() => {
        videoStore.getVideo(videoID);
    }, [videoID]);

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
                    <VideoRenderer video={video}/>
                </div>
                <div>                    
                    <div id="chat-container" className={isChatVisible ? "" : "hidden"}>
                        <ChatComponent videoId={video.videoId} />
                    </div>
                </div>                
            </div>
                    <h1>제목 : {video.title}</h1>
                    <button
                        onClick={() => toggleFavorite(video.videoId)}
                    >
                        {video.favorite ? '★' : '☆'}
                    </button>
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

export default VideoDetail;
