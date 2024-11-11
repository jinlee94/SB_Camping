import {useSearchParams} from "react-router-dom";
import ListComponent from "../../components/campers/ListComponent";

const ListPage = () => {
    const [queryParams] = useSearchParams()
    const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1
    const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10
    return (
        <div>
            <div className="mt-3"><h1>캠퍼 게시판</h1></div>
            <hr/>
            <ListComponent/>
        </div>
    );
}
export default ListPage