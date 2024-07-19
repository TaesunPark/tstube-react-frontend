import {useEffect, useState, useRef} from 'react';

export default function useFetch(url) {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    // const fetchInitiated = useRef(false);
    console.log(url);

    useEffect(() => {                
        // if (!fetchInitiated.current) {
        //     console.log("---start")
        //     fetchInitiated.current = true;
        //     fetchData();
        // }else{
        //     console.log("---start")
        // }
        fetchData();
        console.log("hi")
    }, [url])

    const fetchData = async () => {
        setLoading(true);            
        try {
            console.log(" hi222")
            const response = await fetch(url);
            console.log(response + " hi3222")
            const json = await response.json();                
            setData(json);                
        }catch (error) {
            console.log("---eeestart")
            console.log(error);
            setError(true);
        } finally {
            console.log("---ffstart")
            setLoading(false);
        }
    };

    return {data, loading, error};
}