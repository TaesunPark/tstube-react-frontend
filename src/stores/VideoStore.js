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
            const response = await axios.get(SERVER_URL +'/api/videos');
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
            const response = await axios.get(SERVER_URL + '/api/video', {
                params: {
                    v: videoId,
                }
            });
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
        try {
            const response = await axios.post(SERVER_URL + '/api/video', newVideo);
            runInAction(()=> {
                this.videos.push(response.data);
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to add video';
            })
        }
    }
}
const videoStore = new VideoStore();
export default videoStore;