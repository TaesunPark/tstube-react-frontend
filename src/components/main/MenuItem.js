import { observer } from "mobx-react";
import { useAuth } from "../../provisers/AuthProvider";
import { useNavigate } from "react-router-dom";

const MenuItem = observer(({ item }) => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleClick = (e) => {
        // 외부 링크인 경우 처리
        if (item.external) {
            e.preventDefault();

            // 로그인 메뉴일 경우 이미 로그인되어 있으면 로그이웃
            if (item.totle === '로그인' && auth.isAuthenticated) {
                auth.logout();
            } else {
                window.location.href = item.src;
            }
        } else {
            // 일반 내부 링크
            e.preventDefault();
            navigate(item.src);
        }
    };

    // 로그인 메뉴 텍스트 동적 변경
    const title = item.title === '로그인' && auth.isAuthenticated
        ? '로그아웃'
        : item.title;
    
    return (
        <a
            href={item.src}
            onClick={handleClick}
        >
            <span>{item.icon}</span>
            <span>{title}</span>
        </a>
    );
});

export default MenuItem;