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
            const response = await axios.get(SERVER_URL + '/video', {
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
        let response;

        try {
            response = await axios.post(SERVER_URL + '/video', newVideo);
            runInAction(()=> {                                
            });            
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to add video';
            })
        }        
        return response.data.data;
    }

    setAddVideo(newVideo) {
        this.videos.push(newVideo);
    }
    
}
const videoStore = new VideoStore();
export default videoStore;