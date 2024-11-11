import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border"/>
const QnaList = lazy(()=> import("../components/qna/ListComponent"))
const QnaRead = lazy(()=> import("../components/qna/ReadComponent"))
const QnaAdd = lazy(() => import("../components/qna/AddComponent"))
const QnaModify = lazy(()=>import("../components/qna/ModifyComponent"))

const createQnaRouter = (basePath) => {
    return[
        {
            path: "",
            element : <Navigate replace to={`${basePath}/list`}/>
        },
        {
            path:`${basePath}/list`,
            element : <Suspense fallback={Loading}><QnaList/></Suspense>,

        },
        {
            path: `${basePath}/add`,
            element: <Suspense fallback={Loading}><QnaAdd/></Suspense>
        },
        {
            path: `${basePath}/read/:qbID`,
            element: <Suspense fallback={Loading}><QnaRead/></Suspense> 
        },
        {
            path: `${basePath}/modify/:qbID`,
            element: <Suspense fallback={Loading}><QnaModify/></Suspense> 
        }
    ]
}

// 관리자 Qna 게시판 라우터
const adminQnaRouter = createQnaRouter("/admin/qnas");

// 사용자 Qna 게시판 라우터
const userQnaRouter = createQnaRouter("/qna")

export default {adminQnaRouter, userQnaRouter};