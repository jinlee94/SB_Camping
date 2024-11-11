import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

const Loading = <Spinner animation="border"/>
const Customer = lazy(()=>import("../pages/stats/CustomerPage"))
const ResSales = lazy(()=>import("../pages/stats/ReservationSalesPage"))

const statsRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="reservation-sales"/>
        },
        {
            path: "reservation-sales",
            element: <Suspense fallback={Loading}><ResSales/></Suspense>
        },
        {
            path: "customer",
            element: <Suspense fallback={Loading}><Customer/></Suspense>
        }
    ]
}

export default statsRouter;