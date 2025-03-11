import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../env";
class VideoStore {
    videos = [];
    video = null;
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
    }

    // 서버로부터 비디오 정보 가져오는 로직
    async fetchVideos() {
        this.loading = true; 
        this.error = null;
        
        try {
            const response = await axios.get(SERVER_URL +'/videos');
            runInAction(() => {
                this.videos = response.data.data;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to load videos';
                this.loading = false;
            });
        }
    }

    async getVideo(videoId) {
        this.loading = true; 
        this.error = null;
        
        try {
            const response = await axios.get(`${SERVER_URL}/videos/${videoId}`)
            runInAction(() => {
                this.video = response.data.data;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to load videos';
                this.loading = false;
            });
        }
    }

    // 새로운 비디오 추가 로직
    async addVideo(newVideo) {        
        let response;

        try {
            response = await axios.post(`${SERVER_URL}/videos`, newVideo, {
                withCredentials: true // 쿠키 포함
            });
            return response.data.data;            
        } catch (error) {
            runInAction(() => {
                if (error.response) {
                    // 서버 응답이 있는 경우
                    if (error.response.status === 401) {
                        this.error = '로그인이 필요합니다';
                    } else {
                        this.error = error.response.data.message || 'Failed to add video';
                    }
                } else {
                    this.error = 'Failed to add video';
                }
            })
            throw error;
        }        
    }

    setAddVideo(newVideo) {
        this.videos = [...this.videos, newVideo]
    }
    
}
const videoStore = new VideoStore();
export default videoStore;