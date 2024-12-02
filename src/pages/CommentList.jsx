import { observer } from "mobx-react";
import { useCommentStore } from "../stores/CommentStore";
import videoStore from "../stores/VideoStore"
import { useEffect } from "react";

const CommentListComponent = observer(() => {

    const commentStore = useCommentStore();

    let {comments, loading, error} = commentStore;
    const videoId = videoStore.video.videoId;

    useEffect(() => {
        commentStore.fetchComments(videoId);
    }, [commentStore, videoId])

    if (loading) return <p>Loading...</p>
    if(error) return <p>Error: {error}</p>

    return (
        <div>
            {comments.length > 0 ? (
                <ul>                    
                    {comments.map((comment) => (                        
                        <li key={comment.id}>                            
                            <p>{comment.comment + " hi"}</p>                            
                        </li>
                    ))}
            </ul>
            ) : (
                <p>댓글이 없습니다.</p>
            )}
        </div>
    );
});

export default CommentListComponent;