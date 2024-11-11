import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border"/>
const Add = lazy(() => import("../../pages/lostItem/LostItemAddPage"));
const List = lazy(() => import("../../pages/lostItem/LostItemListPage"));

const a_lostItemRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="list"/>
        },
        {
            path: "add",
            element: <Suspense fallback={Loading}><Add/></Suspense>
        },
        {
            path: "list",
            element: <Suspense fallback={Loading}><List/></Suspense>
        }
    ]
}

export default a_lostItemRouter;