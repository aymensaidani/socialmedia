import React, { useState, useEffect } from "react";
import Post from "../post/Post";
import "./posts.css";
import { makeRequest } from '../../axios';

const Posts = ({userId,data,socket}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await makeRequest.get("/posts?userId="+ userId);
        setPosts(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
    };
  }, []);
  return (
    <div className="posts">
      {error ? "Something went wrong" : isLoading ? "Loading" : (
        posts.map((post) => <Post socket={socket} data={data} post={post} key={post.id} />)
      )}
    </div>
  );
};

export default Posts;
