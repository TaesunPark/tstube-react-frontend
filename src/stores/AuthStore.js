import { makeAutoObservable, runInAction } from 'mobx';

class AuthStore {
  user = null;
  isAuthenticated = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
    // 초기화 시 로컬스토리지에서 사용자 정보 로드
    this.initializeFromStorage();
  }

  // 로컬스토리지에서 사용자 정보 로드
  initializeFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.setUserInfo(user);
        // 추가로 최신 정보를 위해 API 호출
        this.fetchUserInfo();
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error);
        localStorage.removeItem('user');
      }
    }
  }

  // 사용자 정보 설정
  setUserInfo(user) {
    this.user = user;
    this.isAuthenticated = !!user;
    
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // API에서 사용자 정보 가져오기
  async fetchUserInfo() {
    this.isLoading = true;
    try {
      const response = await fetch('http://localhost:8080/api/users/me', {
        credentials: 'include' // 쿠키 포함
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          runInAction(() => {
            this.setUserInfo(result.data);
          });
          return result.data;
        }
      } else if (response.status === 401) {
        // 인증 실패 - 로그아웃 처리
        runInAction(() => {
          this.logout();
        });
      }
    } catch (error) {
      console.error('사용자 정보 로드 실패:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
    return null;
  }

  // 로그인 처리
  async login(token = null) {
    // 토큰은 쿠키에서 처리되므로 직접 사용하지 않음
    // 사용자 정보 가져오기
    const userInfo = await this.fetchUserInfo();
    return !!userInfo;
  }

  // 로그아웃 처리
  async logout() {
    try {
      // 백엔드 로그아웃 API 호출 (구현 필요)
      await fetch('http://localhost:8080/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('로그아웃 API 호출 실패:', error);
    }
    
    // 로컬 상태 정리
    this.setUserInfo(null);
    this.isAuthenticated = false;
    
    // 홈페이지로 리다이렉트
    window.location.href = '/';
  }

  // API 요청 헬퍼 함수
  async fetchWithAuth(url, options = {}) {
    return fetch(url, {
      ...options,
      credentials: 'include', // 쿠키 포함
    });
  }
}

export default AuthStore;