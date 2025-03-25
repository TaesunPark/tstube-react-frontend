import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../env";

class FileUploadStore {
  isUploading = false;
  uploadError = null;
  uploadedFile = null;
  imageFile = null;
  uploadProgress = 0; // 업로드 진행률 추적

  // 청크 크기 설정 (10MB)
  CHUNK_SIZE = 10 * 1024 * 1024;

  constructor() {
    makeAutoObservable(this);
  }

  async uploadFile(file, title) {
    this.isUploading = true;
    this.uploadError = null;
    this.uploadedFile = null;
    this.uploadProgress = 0;
    let videoId = null;
  
    try {
      console.log(`파일 업로드 시작: ${file.name}, 크기: ${file.size} 바이트`);
      
      // 파일을 청크로 나누기
      const totalChunks = Math.ceil(file.size / this.CHUNK_SIZE);
      console.log(`총 청크 수: ${totalChunks}, 청크 크기: ${this.CHUNK_SIZE} 바이트`);
      
      let fileId = null;
  
      // 각 청크를 순차적으로 업로드
      for (let i = 0; i < totalChunks; i++) {
        const start = i * this.CHUNK_SIZE;
        const end = Math.min(file.size, start + this.CHUNK_SIZE);
        const chunk = file.slice(start, end);
        
        console.log(`청크 ${i+1}/${totalChunks} 준비: ${start}-${end} (크기: ${chunk.size} 바이트)`);
  
        const formData = new FormData();
        formData.append("file", chunk, file.name);
        formData.append("chunkIndex", i);
        formData.append("totalChunks", totalChunks);
        formData.append("fileId", fileId || "");
        formData.append("title", title);
        formData.append("fileName", file.name);
        formData.append("fileSize", file.size);
  
        try {
          console.log(`청크 ${i+1} 전송 중...`);
          const response = await axios.post(`${SERVER_URL}/upload/videos/chunk`, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          // 첫 번째 청크 응답에서 fileId 가져오기
          if (i === 0) {
            fileId = response.data.data.fileId;
            console.log(`파일 ID 할당됨: ${fileId}`);
          }
  
          console.log(`청크 ${i+1} 업로드 성공, 서버 응답:`, response.data);
  
          // 진행률 업데이트
          runInAction(() => {
            this.uploadProgress = Math.round(((i + 1) / totalChunks) * 100);
          });
        } catch (chunkError) {
          console.error(`청크 ${i+1} 업로드 실패:`, chunkError);
          throw new Error(`청크 ${i+1} 업로드 중 오류: ${chunkError.message}`);
        }
      }
  
      console.log(`모든 청크 업로드 완료, 파일 완성 요청 중...`);
      
      // 모든 청크가 업로드되면 최종 완료 요청 보내기
      const completeResponse = await axios.post(
        `${SERVER_URL}/upload/videos/complete`,
        { fileId, fileName: file.name, title },
        { withCredentials: true }
      );
  
      console.log(`파일 완성 완료:`, completeResponse.data);
  
      runInAction(() => {
        this.uploadedFile = completeResponse.data.data;
        this.isUploading = false;
        this.uploadProgress = 100;
        videoId = completeResponse.data.data.videoId;
      });
      
      return videoId;
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
      
      runInAction(() => {
        this.uploadError = error.response?.data?.message || error.message || "Failed to upload file";
        this.isUploading = false;
      });
      
      return null;
    }
  }
  async uploadImageFile(file, videoId) {
    // 이미지 파일은 일반적으로 크기가 작으므로 청크 업로드가 필요 없을 수 있지만,
    // 필요하다면 동일한 패턴으로 구현할 수 있습니다
    this.isUploading = true;
    this.uploadError = null;    
    this.imageFile = null;
    let imageFileUrl = null;

    try {
      // 이미지 파일이 큰 경우 청크 업로드로 변경할 수 있음
      const formData = new FormData();
      formData.append("file", file);
      formData.append("videoId", videoId);

      const response = await axios.post(`${SERVER_URL}/upload/thumbnails`, formData, {
        withCredentials: true
      });

      runInAction(() => {
        this.imageFile = response.data.data;
        this.isUploading = false;
        imageFileUrl = response.data.data.fileName;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadError = error.response?.data?.message || "Failed to upload file";
        this.isUploading = false;
      });
    }

    return imageFileUrl;
  }

  resetUploadState() {
    this.isUploading = false;
    this.uploadError = null;
    this.uploadProgress = 0;
  }
}

export const fileUploadStore = new FileUploadStore();