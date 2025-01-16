import React, {useState} from "react";

const ReusableFileUpload = ({ label, setThumbnail }) => {
    const [preview, setPreview] = useState(null); // 미리보기

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // 선택된 파일
        if (file) {
            setThumbnail(file); // 부모 컴포넌트로 파일 전달
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            {/* 파일 업로드 */}
            <label htmlFor="thumbnail-upload" style={{ display: 'block', marginBottom: '8px' }}>
                {label}
            </label>
            <input
                type="file"
                accept="image/*"
                id="thumbnail-upload"
                onChange={handleFileChange}
            />
            {/* 미리보기 */}
            {
                preview && (
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                        <img
                            src={preview}
                            alt="Thumbnail Preview"
                            style={{
                                width: '100%',
                                maxWidth: '150px',
                                borderRadius: '8px',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                              }}
                        />
                    </div>
                )
            }
        </div>
    )


}

export default ReusableFileUpload;