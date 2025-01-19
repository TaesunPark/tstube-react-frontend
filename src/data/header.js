import { CiBaseball } from "react-icons/ci";
import { CiCoins1 } from "react-icons/ci";
import { CiBoxes } from "react-icons/ci";
import { CiMoneyBill } from "react-icons/ci";

import { AiFillGithub } from "react-icons/ai";
import { AiFillYoutube } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";

export const headerMenus = [
    {
        title: "전체 영상 목록",
        icon: <CiBaseball />,
        src: "/"
    },
    {
        title: "스트리밍 영상",
        icon: <CiMoneyBill />,
        src: "/"
    },
    {
        title: "즐겨찾기 영상",
        icon: <CiCoins1 />,
        src: "/"
    },
    {
        title: "내가 올린 영상",
        icon: <CiBoxes />,
        src: "/"
    },    
];

export const searchKeyword = [
    
];

export const snsLink = [
    {
        title: "github",
        url: "https://github.com/TaesunPark",
        icon: <AiFillGithub />
    },
    {
        title: "youtube",
        url: "https://www.youtube.com/@tTube1998",
        icon: <AiFillYoutube />
    },    
    {
        title: "instagram",
        url: "https://www.instagram.com/tae.sun.park/",
        icon: <AiOutlineInstagram />
    },    
]
