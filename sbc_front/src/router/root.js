import { Suspense, lazy } from "react";
import CampingInfoRouter from "./CampingInfoRouter";
import ResRouter from "./ResRouter";
import Spinner from 'react-bootstrap/Spinner';
import MypageRouter from "./MypageRouter";
import {Navigate} from "react-router-dom";
import joinRouter from "./JoinRouter";
import CamperRouter from "./CamperRouter";
import {createBrowserRouter} from "react-router-dom";
import resRouter from "../admin/router/resRouter";
import memberRouter from "../admin/router/memberRouter";
import a_camperRouter from "../admin/router/A_camperRouter";
import noticeRouter from "../admin/router/noticeRouter";
import a_reviewRouter from "../admin/router/A_reviewRouter";
import statsRouter from "../admin/router/statsRouter";
import qnaRoutes from "../admin/router/qnaRouter";
import lostItemRouter from "./lostItemRouter"
import ReviewRouter from "./ReviewRouter";
import a_lostItemRouter from "../admin/router/A_lostItemRouter";

const { adminQnaRouter, userQnaRouter } = qnaRoutes;
const {adminNoticesRouter,userNoticesRouter} = noticeRouter
const Loading = <Spinner animation="border" />;

/*
사용자 페이지
*/

const Main = lazy(() => import("../pages/MainPage"))
const Campingindex = lazy(() => import("../pages/campinginfo/CampingIndexPage"))
const ResIndex = lazy(() => import("../pages/reservation/ResIndexPage"))
const NoticeIndex = lazy(() => import("../pages/community/NoticeIndexPage"))
const Login = lazy(() => import("../pages/login/LoginPage"))
const Join = lazy(() => import("../pages/login/JoinIndexPage"))
const FindPw = lazy(() => import("../pages/login/FindPwPage"))
const FIndEmail = lazy(() => import("../pages/login/FindEmailPage"))
const MyPageIndex = lazy(() => import("../pages/member/MypageIndexPage"))
const CamperIndex = lazy(() =>  import("../pages/campers/CamperIndexPage"))
const QnaIndex = lazy(()=>import("../pages/community/QnaIndexPage"))
const ReviewIndex = lazy(() => import("../pages/review/ReviewIndexPage"))
const Sitemap = lazy(() => import("../pages/login/SitemapPage"))
// 분실물 (이미지 분석)
const LostItem = lazy(() => import("../pages/lostItem/LostItemIndexPage"))

/*
관리자 페이지
*/

// 404 오류 페이지
const NotFound = lazy(() => import("../admin/pages/NotFound.js"))
// 관리자 메인
const A_Main = lazy(() => import("../admin/pages/MainPage"))
//구역관리페이지
const Site = lazy(() => import("../admin/pages/site/SiteManagementsPage.js"))
//예약 인덱스 페이지(전체/취소/예약은 인덱스페이지 안에서 Outlet으로 분류됨 )

const A_ResIndex = lazy(() => import("../admin/pages/res/ResIndexPage.js"))
const MemberIndex = lazy(() => import("../admin/pages/member/MemberIndexPage"))
const StatsIndex = lazy(() => import("../admin/pages/stats/StatsIndexPage"))

// 커뮤니티
const A_CamperIndex = lazy(() => import("../admin/pages/camper/CamperIndexPage"))
const A_NoticeIndex = lazy(() => import("../admin/pages/notice/NoticeIndexPage"))
const A_QnaIndex = lazy(() => import("../admin/pages/qna/QnaIndexPage"))
const A_ReviewIndex = lazy(() => import("../admin/pages/review/ReviewIndexPage"))
const A_LostIndex = lazy(()=> import("../admin/pages/LostIndexPage"))

// 관리자 주소
const A_prefix = "admin/"

const root = createBrowserRouter([
    // 사용자

    {
        path: "",
        element: <Suspense fallback={Loading}><Main/></Suspense>
    },
    {
        path: "login",
        element: <Suspense fallback={Loading}><Login/></Suspense>
    },
    {
        path: "logout",
        element: <Navigate replace to="/"/>
    },
    {
        path: "findpw",
        element: <Suspense fallback={Loading}><FindPw/></Suspense>
    },
    {
        path: "findemail",
        element: <Suspense fallback={Loading}><FIndEmail/></Suspense>
    },
    {
        path: "join",
        element: <Suspense fallback={Loading}><Join/></Suspense>,
        children: joinRouter()
    },
    {
        path: "camping",
        element: <Suspense fallback={Loading}><Campingindex/></Suspense>,
        children: CampingInfoRouter()
    },
    {
        path: "res",
        element: <Suspense fallback={Loading}><ResIndex/></Suspense>,
        children: ResRouter()
    },
    {
        path: "notices",
        element: <Suspense fallback={Loading}><NoticeIndex/></Suspense>,
        children: userNoticesRouter
    },
    {
        path: "qna",
        element: <Suspense fallback={Loading}><QnaIndex/></Suspense>,
        children: userQnaRouter
    },
    {
        path: "mypage",
        element: <Suspense fallback={Loading}><MyPageIndex/></Suspense>,
        children : MypageRouter()
    },
    {
        path: "campers",
        element: <Suspense fallback={Loading}><CamperIndex/></Suspense>,
        children: CamperRouter()
    },
    {
        path: "review",
        element: <Suspense fallback={Loading}><ReviewIndex/></Suspense>,
        children: ReviewRouter()
    },
    {
        path: "sitemap",
        element: <Suspense fallback={Loading}><Sitemap/></Suspense>
    },
    {
        path: `lost`,
        element: <Suspense fallback={Loading}><LostItem/></Suspense>,
        children : lostItemRouter()
    },

    // 관리자

    {//메인페이지 라우터
        path: `${A_prefix}`,
        element: <Suspense fallback={Loading}><A_Main/></Suspense>
    },

    {//위에서 선언한 lazy지연기능이 포함된 페이지 이동 함수
        //예약관리의 기본경로 자식은 resRouter
        //경로가 하나라 라우터 필요 x
        path: `${A_prefix}site`,
        element: <Suspense fallback={Loading}><Site/></Suspense>,

    },
    {//root 페이지 위에서 선언한 lazy지연기능이 포함된 페이지 이동 함수
        //예약관리의 기본경로 자식은 resRouter
        path: `${A_prefix}res/`,
        element: <Suspense fallback={Loading}><A_ResIndex/></Suspense>,
        children: resRouter()

    },
    { // 기타 모든 경로에 대한 404 페이지
        path: "*",
        element: <Suspense fallback={Loading}><NotFound/></Suspense>,
    },
    {
        path: `${A_prefix}member/`,
        element: <Suspense fallback={Loading}><MemberIndex/></Suspense>,
        children: memberRouter()
    },
    {
        path: `${A_prefix}campers/`,
        element: <Suspense fallback={Loading}><A_CamperIndex/></Suspense>,
        children: a_camperRouter()
    },
    {
        path: `${A_prefix}notices/`,
        element: <Suspense fallback={Loading}><A_NoticeIndex/></Suspense>,
        children: adminNoticesRouter
    },
    {
        path: `${A_prefix}qnas/`,
        element: <Suspense fallback={Loading}><A_QnaIndex/></Suspense>,
        children: adminQnaRouter
    },
    {
        path: `${A_prefix}reviews/`,
        element: <Suspense fallback={Loading}><A_ReviewIndex/></Suspense>,
        children: a_reviewRouter()
    },
    {
        path: `${A_prefix}stats/`,
        element: <Suspense fallback={Loading}><StatsIndex/></Suspense>,
        children: statsRouter()
    },
    {
        path: `${A_prefix}lost/`,
        element: <Suspense fallback={Loading}><A_LostIndex/></Suspense>,
        children: a_lostItemRouter()
    }
])

export default root;