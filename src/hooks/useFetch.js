import {useEffect, useState} from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                const json = response.json();
                setData(json);
                console.log(json);
            }catch (error) {
                console.log(error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [url])

    return {data, loading, error};
}

export default useFetch;