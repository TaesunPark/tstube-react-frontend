import { useEffect, useRef } from "react";
import Hls from "hls.js";
import { MEDIA_SERVER_URL } from "../../env";

export function StreamingVideoComponent({ video }) {
    const videoRef = useRef(null);

    useEffect(() => {
        if (Hls.isSupported() && videoRef.current) {
            const hls = new Hls();
            hls.loadSource(MEDIA_SERVER_URL + "/live/12345/index.m3u8");
            hls.attachMedia(videoRef.current);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                console.log("HLS Manifest parsed, ready to play.");
                const videoElement = videoRef.current;
                
                videoElement
                    .play()
                    .catch((err) => {
                        console.error("Error attempting to play video: ", err);
                    });
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
                console.error("HLS error:", data);
            });

            return () => {
                hls.destroy();
            };
        } else if (videoRef.current && videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
            videoRef.current.src = MEDIA_SERVER_URL + "/live/12345/index.m3u8";
            videoRef.current.addEventListener("loadedmetadata", () => {
                videoRef.current.play().catch((err) => {
                    console.error("Error attempting to play video: ", err);
                });
            });
        }
    }, [video]);

    return (
        <div style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
            <video
                ref={videoRef}
                controls
                muted // Required for autoplay
                autoPlay // HTML5 autoplay attribute
                style={{
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                }}
            >
                Your browser does not support HLS.
            </video>
        </div>
    );
}