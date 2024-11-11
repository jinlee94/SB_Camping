import {lazy, Suspense} from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading . . .</div>
const Agreed = lazy(() => import("../pages/login/JoinAgreePage"));
const Input = lazy(() => import("../pages/login/JoinInputPage"));
const Welcome = lazy(() => import("../pages/login/JoinCompletePage"));

const JoinRouter = () => {
    return[
        {
            path: "",
            element : <Navigate replace to="agreed"/>
        },
        {
            path: "agreed",
            element : <Suspense fallback={Loading}><Agreed/></Suspense>
        },
        {
            path: "input",
            element: <Suspense fallback={Loading}><Input/></Suspense>
        },
        {
            path: "welcome",
            element: <Suspense fallback={Loading}><Welcome/></Suspense>
        }
    ]
}

export default JoinRouter;