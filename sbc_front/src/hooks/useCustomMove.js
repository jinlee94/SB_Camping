import {useState} from "react"
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom"

const getNum = (param, defaultValue) => {
    if (!param) {
        return defaultValue
    }
    return parseInt(param)
}

const useCustomMove = () => {
    const navigate = useNavigate()
    const [refresh, setRefresh] = useState(false)
    const [queryParams] = useSearchParams()
    const page = getNum(queryParams.get('page'), 1)
    const size = getNum(queryParams.get('size'), 15)
    const queryDefault = createSearchParams({page, size}).toString() //새로 추가

    const moveToList = (pageParam) => {
        let queryStr = ""
        if (pageParam) {

            const pageNum = getNum(pageParam.page, page)
            const sizeNum = getNum(pageParam.size, size)

            queryStr = createSearchParams({page: pageNum, size: sizeNum}).toString()
        } else {
            queryStr = queryDefault
        }
        navigate({
            pathname: `../list`,
            search: queryStr
        })
        // 동일 클릭시
        setRefresh(!refresh)
    }
    const moveToModify = (num) => {
        console.log(queryDefault)
        navigate({
            pathname: `../modify/${num}`,
            search: queryDefault //수정시에 기존의 쿼리 스트링 유지를 위해
        })
    }
    const moveToRead = (num) => {
        console.log(queryDefault)
        navigate({
            pathname: `../read/${num}`,
            search: queryDefault
        })
    }

    const moveToAdd = () => {
        navigate('/campers/add')
    }

    return {moveToList, moveToModify, moveToRead, moveToAdd, page, size, refresh}
}
export default useCustomMove