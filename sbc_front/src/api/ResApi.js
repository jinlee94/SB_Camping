import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8080"

const prefix = `${API_SERVER_HOST}/api/res`

export const getSiteList = async () => {
    const res = await axios.get(`${prefix}/siteList`)

    return res.data
}

export const resAdd = async (resObj) => {
    try {
        const res = await axios.post(`${prefix}/`, resObj)
        return res.data
    } catch (error) {
        throw error;
    }
}

export const resCheck = async () => {
    try {
        const res = await axios.get(`${prefix}/resList`)
        return res.data
    } catch (error) {
        throw error;
    }
}
