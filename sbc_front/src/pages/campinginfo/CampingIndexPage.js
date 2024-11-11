import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CampingMenu from "../../layouts/CampingMenu";

const CampingIndexPage = () => {
    return(
        <BasicLayout>
            <CampingMenu></CampingMenu>
                <div>
                    <Outlet/>
                </div>
        </BasicLayout>
    );
}

export default CampingIndexPage;