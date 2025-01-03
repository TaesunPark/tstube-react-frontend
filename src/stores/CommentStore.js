import axios from "axios";
import { makeAutoObservable, runInAction } from "mobx";
import { createContext, useContext } from "react";
import { SERVER_URL } from "../env";

class CommentStore {    
    comments = [];
    loading = false;
    error = null;
    videoId = null;
    comment = null;
    createTime = null;

    constructor () {
        makeAutoObservable(this);
    }

    // 전체 댓글 불러오기
    async fetchComments(videoId) {
        this.loading = true;
        this.error = null;
        
        try {            
            const response = await axios.get(SERVER_URL + '/api/comments', {
                params: {
                    v: videoId,
                }
            });            
            
            runInAction(() => {
                this.comments = response.data.data;                
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to load videos';
                this.loading = false;
            });
        }
    }

    // const newComment = {
    //     videoId: video.videoId,
    //     comment: video.comment
    // };
    async addComment(newComment) {
        try {
            const response = await axios.post(SERVER_URL + '/api/comment', newComment);
            
            runInAction(() => {
                const newComments = [...this.comments];                
                newComments.push(newComment);
                this.comments = newComments;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to add comment'
            })
        }
    }

    // 댓글 수정하기
    async updateComment() {
        
    }
    
}

// Context 생성
const CommentStoreContext = createContext(null);

// Provider 생성
export const CommentStoreProvider = ({ children }) => {
    const store = new CommentStore();
    return (
        <CommentStoreContext.Provider value={store}>
            {children}
        </CommentStoreContext.Provider>
    )
}

export const useCommentStore = () => {
    const context = useContext(CommentStoreContext);
    if (!context) {
        throw new Error("useCommentStore must be used within a CommentStore");   
    }
    return context;
}

const commentStore = new CommentStore();
export default commentStore;