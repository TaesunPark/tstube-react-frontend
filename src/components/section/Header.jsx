import React from 'react'
import { observer } from 'mobx-react-lite';
import { headerMenus, searchKeyword, snsLink } from "../../data/header";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provisers/AuthProvider';

const Header = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    
    const handleMenuClick = (menu, e) => {
        // 외부 링크인 경우 처리
        if (menu.external) {
            e.preventDefault();
            
            // 로그인 메뉴일 경우 이미 로그인되어 있으면 로그아웃
            if (menu.title === '로그인' && auth.isAuthenticated) {
                auth.logout();
            } else {
                window.location.href = menu.src;
            }
        }
    };
    
    return (
        <header id='header' role='banner'>
            <h1 className='header__logo'>
                <a href="/">
                    <em></em>  
                    <span>태<br />튜브</span>
                </a>
            </h1>
            <div className='header__menu'>
                <ul className='menu'>
                    {headerMenus.map((menu, key) => (
                        <li key={key} className={location.pathname === menu.src ? 'active':''}>
                            <Link 
                                to={menu.external ? '#' : menu.src}
                                onClick={(e) => handleMenuClick(menu, e)}
                            >
                                {menu.icon}
                                {menu.title === '로그인' && auth.isAuthenticated ? '로그아웃' : menu.title}
                            </Link>
                        </li>
                    ))}
                </ul>
                <ul className='keyword'>
                    {searchKeyword.map((keyword, key) => (
                        <li key={key} className={location.pathname === keyword.src ? 'active' : ''}>
                            <Link to={keyword.src}>
                                {keyword.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='header__sns'>
                {/* 로그인 상태 표시 (선택사항) */}
                {auth.isAuthenticated && (
                    <div className="auth-status">
                        안녕하세요, {auth.user?.nickname || '사용자'}님!
                    </div>
                )}
                <ul>
                    {snsLink.map((sns, key) => (
                        <li key={key}>
                            <a href={sns.url} target="_blank" rel="noopener noreferrer" aria-label={sns.title}>
                                <span>{sns.icon}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    )
});

export default Header;