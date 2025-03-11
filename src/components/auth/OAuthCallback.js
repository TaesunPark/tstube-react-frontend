import { observer } from "mobx-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../provisers/AuthProvider";
import { useNavigate } from "react-router-dom";

const OAuthCallback = observer(() => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const navigate = useNavigate();
    
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        const errorParam = urlParams.get('error');

        if (errorParam) {
            setError(`로그인 오류: ${errorParam}`);
            setLoading(false);
            return;
        }

        if (!token) {
            setError('토큰이 없습니다. 로그인에 실패했습니다.');
            setLoading(false);
            return;
        }

        try {
            // Auth 스토어를 통해 로그인 처리
            auth.login(token);
            
            // 로그인 성공 후 메인 페이지로 리다이렉트
            setTimeout(() => {
                navigate('/')
            }, 1500);
        } catch (err) {
            setError('로그인 처리 중 오류가 발생했습니다: ' + err.message);
            setLoading(false);
        }
    }, [auth, navigate]);

    if (error) {
        return (
            <>
                <h2>
                    로그인 오류
                </h2>
                <button
                    onClick={() => navigate('/')}
                >
                    홈으로 돌아가기
                </button>
            </>
        )
    }

    return (
        <h2>
            로그인 처리중, 잠시만 기다려주세요..
        </h2>
    )
});

export default OAuthCallback;

