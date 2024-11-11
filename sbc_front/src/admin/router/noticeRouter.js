import {Suspense, lazy} from "react";
import {Navigate} from "react-router-dom";
//공지사항페이지 경로를 세부 설정해주는 noticeRouter
const Loading = <div>Loading...</div>;
const NoticeRead = lazy(() => import("../components/notice/ReadComponent"))
const NoticeList = lazy(() => import("../components/notice/ListComponent"));
const NoticeUpdate = lazy(() => import("../components/notice/UpdateComponent"));
const NoticeAdd = lazy(() => import("../components/notice/AddComponent"));



const noticeRouter=(basePath)=>{
    return [
         {//list로 리다이렉션
            path: "",
            element: <Navigate replace to={`${basePath}/list`}/>
        },
         { //공지사항 목록 페이지 라우팅
            path: `${basePath}/list`,
            element: <Suspense fallback={Loading}><NoticeList/></Suspense>
        },

        { //공지사항  작성 페이지 라우팅
            path: `${basePath}/add`,
            element: <Suspense fallback={Loading}><NoticeAdd/></Suspense>
        },

        { //공지사항 내용 페이지 라우팅  :nid를 넣음으로 브라우저에서 특정한 번호를 조회하는데 사용함
            path: `${basePath}/read/:nid`,
            element: <Suspense fallback={Loading}><NoticeRead/></Suspense>
        },

        { //공지사항  수정 페이지 라우팅
            path: `${basePath}/update/:nid`,
            element: <Suspense fallback={Loading}><NoticeUpdate/></Suspense>
        }
    ]
}

//관리자 페이지 공지게시판 라우터
const adminNoticesRouter = noticeRouter("/admin/notices");

//사용자 페이지 공지게시판 라우터
const userNoticesRouter = noticeRouter("/notices");

export default {adminNoticesRouter,userNoticesRouter};