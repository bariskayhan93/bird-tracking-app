import axios from "axios"

export const axiosInstance = axios.create({
    baseURL : "https://bird-tracking.herokuapp.com/api/"
})