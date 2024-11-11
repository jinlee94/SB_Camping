import { useParams } from "react-router-dom";
import ModifyComponent from "../../components/campers/ModifyComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const ModifyPage = () => {
    const { cBoardId } = useParams();

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if(!isLogin){
        return moveToLoginReturn()
    }

    return (
        <div className="container mt-4">
            <div className="mt-3"><h1>캠퍼 게시판</h1></div>
            <hr/>
            <ModifyComponent cBoardId={cBoardId}/> {/* ModifyComponent에 cBoardId 전달 */}
        </div>
    );
}

export default ModifyPage;
