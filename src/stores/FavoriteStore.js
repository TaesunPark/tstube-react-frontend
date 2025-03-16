import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../env";
import videoStore from "./VideoStore";

class FavoriteStore {
    favoriteVideos = [];
    loading = false;
    error = null;

    constructor() {
        makeAutoObservable(this);
        console.log("FavoriteStore 인스턴스 생성됨")
    }

    // 즐겨찾기 목록 가져오기
    getFavorites = async () => {
        this.loading = true;
        this.error = null;

        try {
            const response = await axios.get(`${SERVER_URL}/favorites`, {
                withCredentials: true
            });
            runInAction(() => {
                this.favoriteVideos = response.data.data;
                this.loading = false;
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

    // 즐겨찾기 추가/제거 토글 메소드
    toggleFavorite = async (videoId) => {
        try {            
            const currentVideo = videoStore.video;
                
            if (currentVideo.isFavorite) {
                // 즐겨찾기 제거
                await axios.delete(`${SERVER_URL}/favorites/${videoId}`, {
                    withCredentials: true
                });
                
                // videoStore의 현재 비디오 업데이트
                
                runInAction(() => {
                    videoStore.video.isFavorite = false;
                });
                
                // favoriteVideos 배열에서 제거
                runInAction(() => {
                    this.favoriteVideos = this.favoriteVideos.filter(v => v.id !== videoId);
                });
            } else {                
                await axios.post(`${SERVER_URL}/favorites/${videoId}`, {}, {
                    withCredentials: true
                });                
                
                runInAction(() => {
                    videoStore.video.isFavorite = true;
                });                
                
                // getFavorites 호출하여 즐겨찾기 목록 갱신
                await this.getFavorites();
            }
        } catch (error) {
            console.error('즐겨찾기 토글 실패', error);

            runInAction(() => {
                this.error = '즐겨찾기 처리 중 오류가 발생했습니다.';
            });
        }
    }
    
    // 특정 비디오가 즐겨찾기인지 확인하는 메서드 (UI에서 활용 가능)
    isVideoFavorite = (videoId) => {
        return this.favoriteVideos.some(video => video.id === videoId);
    }
}

const favoriteStore = new FavoriteStore();
export default favoriteStore;