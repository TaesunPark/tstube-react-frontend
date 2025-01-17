export function VideoComponent({ video }) {
    // video.src가 URL이면 iframe으로 렌더링
    const isUrl = /^https?:\/\/[^\s]+$/.test(video.src);
  
    return (
      <div>
        {isUrl ? (
          <iframe
            src={video.src}
            width="100%"
            height="315"            
            allowFullScreen
            title="video"
          ></iframe>
        ) : (
            <div
                dangerouslySetInnerHTML={{ __html: video.src }}
            />
        )}
      </div>
    );
  }