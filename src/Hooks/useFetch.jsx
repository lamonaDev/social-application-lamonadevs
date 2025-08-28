import axios from "axios";
import { useEffect, useState } from "react";
export function useFetch(method, URL, requestBody, headers) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    function callApi() {
        setIsLoading(true)
        axios({
            method,
            url: URL,
            data: requestBody,
            headers
        }).then((response) => {
            if (response.data.message === 'success') {
                setData(response.data)
            }
        }).catch((err) => {
            setError(err.message)
        }).finally(() => {
            setIsLoading(false)
        })
    }
    useEffect(() => {
        callApi()
    }, [])
    return { data, error, isLoading }
}