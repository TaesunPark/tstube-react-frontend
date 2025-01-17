export function VideoComponent({ video }) {
    return (
        <div
            dangerouslySetInnerHTML={{ __html: video.src }}
        />
    );
}