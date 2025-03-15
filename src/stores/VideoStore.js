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
        console.log("VideoStore 인스턴스 생성됨")
    }

    // 서버로부터 비디오 정보 가져오는 로직
    fetchVideos = async () => {
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

    getVideo = async(videoId) => {
        this.loading = true; 
        this.error = null;
        console.log("getVideo 호출", videoId)

        try {
            const response = await axios.get(`${SERVER_URL}/videos/${videoId}`)
            runInAction(() => {
                this.video = response.data.data;
                this.loading = false;                
                console.log("video 설정됨", this.video);
            });
        } catch (error) {
            runInAction(() => {
                this.error = 'Failed to load videos';
                this.loading = false;
            });
        }
    }

    // 새로운 비디오 추가 로직
    addVideo = async(newVideo) => {        
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

    setAddVideo = (newVideo) => {
        this.videos = [...this.videos, newVideo]
    }

    // 즐겨찾기 추가/제거 토글 메소드
    toggleFavorite = async (videoId) => {
        try {
            console.log(this.video.favorite, "favorite");
            if (this.video.favorite) {
                // 즐겨찾기 제거
                await axios.delete(`${SERVER_URL}/favorites/${videoId}`, {
                    withCredentials: true
                });
                runInAction(() => {
                    this.video.favorite = false;
                })
            } else {                
                await axios.post(`${SERVER_URL}/favorites/${videoId}`, {}, {
                    withCredentials: true
                });
                runInAction(() => {
                    this.video.favorite = true;
                })
            }
        } catch (error) {
            console.error('즐겨찾기 토글 실패', error);

            runInAction(() => {
                this.error = '즐겨찾기 처리 중 오류가 발생했습니다.';
            });
        }
    }

    getFavorites = async () => {
        this.loading = true;
        this.error = null;

        try {
            const response = await axios.get(`${SERVER_URL}/favorites`, {
                withCredentials: true
            });

            return response.data.data;
        } catch (error) {
            runInAction(() => {
                this.error = '즐겨찾기 목록을 불러오는데 실패했습니다'
                this.loading = false;
            });
            return [];
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    }
    
}
const videoStore = new VideoStore();
export default videoStore;