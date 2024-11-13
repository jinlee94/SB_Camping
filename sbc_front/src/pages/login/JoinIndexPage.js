import BasicLayout from "../../layouts/BasicLayout";
import LoginMenu from "../../layouts/LoginMenu";
import {Outlet} from "react-router-dom";

const JoinIndexPage = () => {
    return(
        <BasicLayout>
            <LoginMenu/>
            <div style={{marginTop : '20px'}}>
                <h3>회원가입</h3>
                <hr></hr>
                <Outlet/>
            </div>
        </BasicLayout>
    );
}

export default JoinIndexPage;