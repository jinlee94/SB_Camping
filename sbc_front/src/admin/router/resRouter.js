import {Suspense,lazy}   from "react";
import {Navigate} from "react-router-dom";

//예약 페이지에서 경로를 세부 설정해주는 resRouter....
const Loading = <div>Loading...</div>;
const ResTotal = lazy(() => import("../pages/res/TotalPage"))
const DateSite = lazy(() => import("../pages/res/ResCalendarPage"));




const resRouter = () => {
    return[
        { //예약리스트 달력형  페이지 라우터
            path: "total",
            element: <Suspense fallback={Loading}><ResTotal/></Suspense>
        },
        { //예약리스트 달력형  페이지 라우터
            path: "datesite",
            element: <Suspense fallback={Loading}><DateSite/></Suspense>
        },
        {//total로 리다이렉션
            path: "",
            element: <Navigate replace to="total"/>

        }

    ]
}
export default resRouter;