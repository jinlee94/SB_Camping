import {lazy, Suspense} from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border" />;
const MyPageRes = lazy(() => import("../pages/member/MyPageResPage"));
const MypageResDetail = lazy(() => import("../pages/member/MypageResDetailPage"))
const MypageInfo = lazy(() => import("../pages/member/MypageMyInfoPage"));
const WithDraw = lazy(() => import("../pages/member/MypageWithdrawPage"))
const ModPw = lazy(() => import("../pages/member/MypageModPwPage"));

const MypageRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="res"/>
        },
        {
            path: "res",
            element : <Suspense fallback={Loading}><MyPageRes/></Suspense>
        },
        {
            path: "res/detail",
            element: <Suspense fallback={Loading}><MypageResDetail/></Suspense>
        },
        {
            path: "info",
            element: <Suspense fallback={Loading}><MypageInfo/></Suspense>
        },
        {
            path: "withdraw",
            element: <Suspense fallback={Loading}><WithDraw/></Suspense>
        },
        {
            path: "modpw",
            element: <Suspense fallback={Loading}><ModPw/></Suspense>
        }

    ]
}

export default MypageRouter;