import { useState } from "react";
import { useCommentStore } from "../stores/CommentStore";
import videoStore from "../stores/VideoStore";

const CommentComponent = () => {
    const [inputValue, setInputValue] = useState("");
    const commentStore = useCommentStore();
    const { video } = videoStore;

    const handleAddComment = () => {        
        if(inputValue.trim() !== "") {
            // 서버에 댓글 보내기
            const newComment = {
                videoId: video.videoId,
                comment: inputValue
            };            
            commentStore.addComment(newComment);                        
            setInputValue(""); // 입력 필드 초기화
        }
    }

    return (
        <div>                        
            <input 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="댓글을 입력하세요"
            />
            <button onClick={handleAddComment}>전송</button>
        </div>
    )
}

export default CommentComponent;