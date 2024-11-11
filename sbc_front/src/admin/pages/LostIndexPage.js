import BasicLayout from "../../admin/layouts/BasicLayout";
import CommunityMenu from "../../admin/components/menus/CommunityMenu";
import {Outlet} from "react-router-dom";

const LostIndexPage = () => {

    return (
        <>
            <BasicLayout>
                <CommunityMenu/>
                <div className="my-4 ">
                    <main>
                        <Outlet/>
                    </main>
                </div>
            </BasicLayout>
        </>
    );

}

export default LostIndexPage;