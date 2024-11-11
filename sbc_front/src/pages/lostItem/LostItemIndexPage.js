import "../../css/lostItem.css"
import {Outlet} from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import CommunityMenu from "../../layouts/CommunityMenu";

const LostItemIndexPage = () => {


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

export default LostItemIndexPage;