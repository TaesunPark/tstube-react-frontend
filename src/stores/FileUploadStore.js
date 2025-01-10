import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";
import { SERVER_URL } from "../env";

class FileUploadStore {
  isUploading = false;
  uploadError = null;
  uploadedFile = null;

  constructor() {
    makeAutoObservable(this);
  }

  async uploadFile(file, title) {
    this.isUploading = true;
    this.uploadError = null;
    this.uploadedFile = null;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title); // 제목도 함께 보내기

      const response = await axios.post(`${SERVER_URL}/upload`, formData);

      runInAction(() => {
        this.uploadedFile = response.data; // 서버에서 반환된 파일 정보
        this.isUploading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.uploadError = error.response?.data?.message || "Failed to upload file";
        this.isUploading = false;
      });
    }
  }
}

export const fileUploadStore = new FileUploadStore();