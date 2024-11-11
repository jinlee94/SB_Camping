import React, {lazy, Suspense} from 'react';
import {Navigate} from "react-router-dom";

const ReviewRouter = () => {
    const Loading = <div>Loading . . .</div>
    const ReviewListPage = lazy(() => import("../components/review/ReviewListComponent"))
    const ReviewAddPage = lazy(() => import("../components/review/ReviewAddComponent"))
    const ReviewReadPage = lazy(() => import("../components/review/ReviewReadComponent"))
    const ReviewModifyPage = lazy(() => import("../components/review/ReviewModifyComponent"))


    return [
        {
            path: "",
            element : <Navigate replace to="list"/>
        },
        {
            path: "list",
            element: <Suspense fallback={Loading}><ReviewListPage/></Suspense>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><ReviewAddPage/></Suspense>
        },
        {
            path: "read/:reviewID",
            element: <Suspense fallback={Loading}><ReviewReadPage/></Suspense>
        },
        {
            path: "modify/:reviewID",
            element: <Suspense fallback={Loading}><ReviewModifyPage/></Suspense>
        }
    ];
};

export default ReviewRouter;