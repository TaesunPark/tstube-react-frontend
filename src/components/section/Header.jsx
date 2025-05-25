import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { headerMenus, searchKeyword, snsLink } from "../../data/header";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../provisers/AuthProvider';

const Header = observer(() => {
    const location = useLocation();
    const navigate = useNavigate();
    const auth = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // 화면 크기 감지
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // 모바일 메뉴 열기/닫기
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // 모바일 메뉴 닫기
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    
    const handleMenuClick = (menu, e) => {

        if (isMobile) {
            closeMobileMenu();
        }

        // 외부 링크인 경우 처리
        if (menu.external) {
            e.preventDefaul();
            
            // 로그인 메뉴일 경우 이미 로그인되어 있으면 로그아웃
            if (menu.title === '로그인' && auth.isAuthenticated) {
                auth.logout();
            } else {
                window.location.href = menu.src;
            }
        }
    };
    
    return (
        <>
        <header id='header' role='banner'>
            <h1 className='header__logo'>
                <a href="/">
                    <em></em>  
                    <span>태<br />튜브</span>
                </a>
            </h1>

            {/* {햄버거 메뉴 버튼 (모바일 전용)} */}
            <button
                className={`header__hamburger ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={toggleMobileMenu}
                aria-label="메뉴 열기"
                aria-expanded={isMobileMenuOpen}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

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
        <div
            className={`mobile-overlay ${isMobileMenuOpen ? 'show' : ''}`}
            onClick={closeMobileMenu}
            aria-hidden="true"
        />
        {/* 모바일 사이드 메뉴 */}
        <nav 
                className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
                aria-hidden={!isMobileMenuOpen}
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    width: '280px',
                    maxWidth: '85vw',
                    height: '100vh',
                    backgroundColor: 'var(--black, #111)',
                    zIndex: 1002,
                    transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s ease',
                    overflowY: 'auto',
                    borderLeft: '1px solid var(--black200, #333)'
                }}
            >
                <div className="mobile-menu__content">
                    {/* 모바일 헤더 */}
                    <div className="mobile-menu__header" style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '20px', 
                        borderBottom: '1px solid var(--black200, #333)', 
                        backgroundColor: 'var(--black, #000)' 
                    }}>
                        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--white, white)', fontWeight: 700 }}>메뉴</h2>
                        <button 
                            className="mobile-menu__close"
                            onClick={closeMobileMenu}
                            aria-label="메뉴 닫기"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--white, white)',
                                fontSize: '24px',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* 사용자 정보 */}
                    {auth.isAuthenticated && (
                        <div className="mobile-menu__user" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--black200, #333)',
                            backgroundColor: 'var(--black, #111)'
                        }}>
                            <div className="user-avatar" style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: 'var(--red, #ff4444)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--white, white)',
                                fontWeight: 'bold',
                                fontSize: '16px'
                            }}>
                                {auth.user?.nickname?.charAt(0) || 'U'}
                            </div>
                            <div className="user-info">
                                <div className="user-name" style={{ color: 'var(--white, white)', fontWeight: 500, marginBottom: '2px', fontSize: '14px' }}>
                                    {auth.user?.nickname || '사용자'}님
                                </div>
                                <div className="user-status" style={{ color: 'var(--white200, #ccc)', fontSize: '12px' }}>로그인됨</div>
                            </div>
                        </div>
                    )}
                    
                    {/* 메인 메뉴 - headerMenus 데이터 표시 */}
                    <div className="mobile-menu__section" style={{ padding: '16px 0', borderBottom: '1px solid var(--black200, #333)' }}>
                        <h3 style={{ 
                            margin: '0 0 12px 0', 
                            padding: '0 20px', 
                            fontSize: '12px', 
                            color: 'var(--white200, #ccc)', 
                            textTransform: 'uppercase', 
                            fontWeight: 600 
                        }}>메인 메뉴 ({headerMenus?.length || 0}개)</h3>
                                                
                        {!headerMenus || headerMenus.length === 0 ? (
                            <div style={{ padding: '20px', color: 'var(--white200, #ccc)', fontSize: '14px' }}>
                                메뉴 데이터가 없습니다. headerMenus 배열을 확인해주세요.
                            </div>
                        ) : (
                            <ul className="mobile-menu__list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {headerMenus.map((menu, key) => {
                                    console.log(`렌더링 메뉴 ${key}:`, menu);
                                    return (
                                        <li key={key} className={location.pathname === menu.src ? 'active' : ''}>
                                            <Link 
                                                to={menu.external ? '#' : menu.src}
                                                onClick={(e) => handleMenuClick(menu, e)}
                                                className="mobile-menu__link"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '14px',
                                                    padding: '12px 20px',
                                                    textDecoration: 'none',
                                                    color: 'var(--white200, #ccc)',
                                                    transition: 'all 0.3s ease',
                                                    backgroundColor: location.pathname === menu.src ? 'var(--black100, #333)' : 'transparent'
                                                }}
                                                onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--black100, #333)'}
                                                onMouseLeave={(e) => {
                                                    if (location.pathname !== menu.src) {
                                                        e.target.style.backgroundColor = 'transparent';
                                                    }
                                                }}
                                            >
                                                <span className="menu-icon" style={{ 
                                                    width: '20px', 
                                                    height: '20px', 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center' 
                                                }}>
                                                    {menu.icon || '📌'}
                                                </span>
                                                <span className="menu-text" style={{ fontSize: '15px', fontWeight: 400 }}>
                                                    {menu.title === '로그인' && auth.isAuthenticated ? '로그아웃' : menu.title}
                                                </span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </nav>
        </>
    )
});

export default Header;