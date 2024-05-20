import React from 'react'

import { headerMenus, searchKeyword, snsLink } from "../../data/header";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    return (
        <header id='header' role='banner'>
            <h1 className='header__logo'>
                <a href="/">
                    <em></em>  
                    <span>webs<br />youtube</span>
                </a>
            </h1>
            <div className='header__menu'>
                <ul className='menu'>
                    {headerMenus.map((menu, key) => (
                        <li key={key} className={location.pathname === menu.src ? 'active':''}>
                            <Link to={menu.src}>
                                {menu.icon}{menu.title}
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
}

export default Header