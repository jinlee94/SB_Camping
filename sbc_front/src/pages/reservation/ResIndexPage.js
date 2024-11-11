import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import ReservationMenu from "../../layouts/ReservationMenu";

const ResIndexPage = () => {
    return(
        <BasicLayout>
            <ReservationMenu/>
            <div>
                <Outlet/>
            </div>
        </BasicLayout>
    )
}

export default ResIndexPage;