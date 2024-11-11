import AddComponent from "../../components/campers/AddComponent";
import useCustomLogin from "../../hooks/useCustomLogin";

const AddPage = () => {

    // 로그인 여부 확인
    const {isLogin, moveToLoginReturn} = useCustomLogin()
    if(!isLogin){
        alert('회원만 이용가능합니다.')
        return moveToLoginReturn()
    }

    return (
        <div>
                <div className="mt-3"><h1>캠퍼 게시판</h1></div>
                <hr/>
            <AddComponent/>
        </div>
    );
}

export default AddPage;
