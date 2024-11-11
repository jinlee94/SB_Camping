import { Suspense, lazy } from "react";
import { Navigate } from "react-router-dom";

const Loading = <div>Loading . . .</div>
const Introduction = lazy(() => import("../pages/campinginfo/IntroductionPage"))
const HowToCome = lazy(() => import("../pages/campinginfo/HowToComePage"))
const FacilityGuide = lazy(() => import("../pages/campinginfo/FacilityGuidePage"))


const CampingInfoRouter = () => {
    return [
        {
            path: "how",
            element : <Suspense fallback={Loading}><HowToCome/></Suspense>
        },
        {
            path : "intro",
            element: <Suspense fallback={Loading}><Introduction/></Suspense>
        },
        {
            path: "*",
            element : <Navigate replace to="intro"/>
        },
        {
            path: "guide",
            element: <Suspense fallback={Loading}><FacilityGuide/></Suspense>
        }
    ]
}

export default CampingInfoRouter;