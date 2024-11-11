// CamperRouter.js
import { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border" />;
const List = lazy(() => import("../pages/campers/ListPage"));
const Read = lazy(() => import("../pages/campers/ReadPage"));
const Add = lazy(() => import("../pages/campers/AddPage"));
const Modify = lazy(() => import("../pages/campers/ModifyPage"));

const CamperRouter = () => {
    return [
        {
            path: "",
            element: <Navigate replace to="list" />
        },
        {
            path: "list",
            element: <Suspense fallback={Loading}><List /></Suspense>
        },
        {
            path: "read/:cBoardId", // 동적 경로 설정
            element: <Suspense fallback={Loading}><Read /></Suspense>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><Add /></Suspense>
        },
        {
            path: "modify/:cBoardId", // 동적 경로 설정
            element: <Suspense fallback={Loading}><Modify /></Suspense>
        },
    ]
}

export default CamperRouter;
