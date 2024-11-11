import { Outlet } from "react-router-dom";
import BasicLayout from "../../layouts/BasicLayout";
import ResMenu from "../../components/menus/ResMenu";

const ResIndexPage = () =>{
    return(
        <BasicLayout>
            <ResMenu/>
            <div>

                <div className="flex flex-wrap w-full">
                    {/* 자식 라우트의 컴포넌트가 여기에 렌더링됩니다 */}
                    {/*아웃렛은 컴포넌트를 넣기위해 미리 만들어놓은 빈 공간 같은 곳이라고 생각하면 된다*/}
                    <Outlet/>
                </div>
            </div>
        </BasicLayout>
    );
};

export default ResIndexPage;