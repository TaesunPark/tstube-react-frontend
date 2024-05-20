import React from 'react'
import useFetch from '../hooks/useFetch'

const Video = () => {
  const url = "http://localhost:3000/video/videoData.json";    
  const {data, loading, error } = useFetch(url);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (    
    <div>
      {data}
    </div>
  )
}

export default Video
