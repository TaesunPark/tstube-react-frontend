import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../env";

class FileUploadStore {
  isUploading = false;
  uploadError = null;
  uploadedFile = null;
  imageFile = null;

  constructor() {
    makeAutoObservable(this);
  }

  async uploadFile(file, title) {
    this.isUploading = true;
    this.uploadError = null;
    this.uploadedFile = null;
    let videoId = null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title); // 제목도 함께 보내기

      const response = await axios.post(`${SERVER_URL}/upload/videos`, formData);

      runInAction(() => {
        this.uploadedFile = response.data.data; // 서버에서 반환된 파일 정보
        this.isUploading = false;
        videoId = response.data.data.videoId;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadError = error.response?.data?.message || "Failed to upload file";
        this.isUploading = false;
      });
    }
    return videoId;
  }

  async uploadImageFile(file, videoId) {
    this.isUploading = true;
    this.uploadError = null;    
    this.imageFile = null;
    let imageFileUrl = null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("videoId", videoId);

      const response = await axios.post(`${SERVER_URL}/upload/thumbnails`, formData)

      runInAction(() => {
        this.imageFile = response.data.data;
        this.isUploading = false;
        imageFileUrl = response.data.data.fileName;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadError = error.response?.data?.message || "Failed to upload file";
        this.isUploading = false;
      })
    }

    return imageFileUrl;
  }

}

export const fileUploadStore = new FileUploadStore();