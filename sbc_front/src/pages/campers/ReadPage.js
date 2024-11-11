import { useCallback } from "react";
import { createSearchParams, useNavigate, useParams, useSearchParams } from "react-router-dom";
import ReadComponent from "../../components/campers/ReadComponent";

const ReadPage = () => {
    const { cBoardId } = useParams(); // cBoardId로 변경
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;

    const queryStr = createSearchParams({ page, size }).toString();

    const moveToModify = useCallback(() => {
        navigate({
            pathname: `/campers/modify/${cBoardId}`,
            search: queryStr
        });
    }, [cBoardId, page, size]);

    const moveToList = useCallback(() => {
        navigate({ pathname: `/campers/list`, search: queryStr }); // cBoardId와 관련이 없는 경우 그대로 유지
    }, [page, size]);

    return (
        <div>
            <div className="mt-3"><h1>캠퍼 게시판</h1></div>
            <hr/>
            <ReadComponent cBoardId={cBoardId}/> {/* ReadComponent에 cBoardId 전달 */}
        </div>
    );
};

export default ReadPage;
