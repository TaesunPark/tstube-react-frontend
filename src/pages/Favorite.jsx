import React, { useEffect } from 'react';
import { VideoItem } from '../components/video/VideoItem';
import favoriteStore from '../stores/FavoriteStore';
import { observer } from 'mobx-react';
import FloatingButton from '../components/video/FloatingButton';
import { useAuth } from '../provisers/AuthProvider';

const Favorite = observer(() => {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    alert("로그인이 필요한 기능입니다.");
    return;
  }

  useEffect(() => {
    if (auth.isAuthenticated) {
        favoriteStore.getFavorites();        
    }
  }, [auth.isAuthenticated]);

  return (
    <div id="main" role="main">
      <div id="video-container2">
        {favoriteStore.favoriteVideos.length > 0 ? (
          favoriteStore.favoriteVideos.map((video) => (
            <div id="video-container3" key={video.id}>
              <VideoItem 
                video={video}                
              />
              <div id="video-title">
                <span>{video.title}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-favorites">
            <p>즐겨찾기한 비디오가 없습니다.</p>
          </div>
        )}
      </div>
      <FloatingButton/>
    </div>
  );
});

export default Favorite;
