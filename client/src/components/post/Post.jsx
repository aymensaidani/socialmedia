import './post.css';

import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useContext, useEffect, useState } from 'react';
import { FaHeart } from "react-icons/fa6";
import { makeRequest } from '../../axios';
import { AuthContext } from '../../context/authContext.jsx';
import { IoIosMore } from 'react-icons/io';

import moment from 'moment';
const Post = ({ post, data,socket }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [likes, setLikes] = useState([]);
  const [isLoadingLikes, setIsLoadingLikes] = useState(false);
  const [errorLikes, setErrorLikes] = useState(null);
  const { currentUser } = useContext(AuthContext);

  const fetchLikes = async () => {
    setIsLoadingLikes(true);
    try {
      const response = await makeRequest.get('/likes?postId=' + post.id);
      setLikes(response.data);
      setErrorLikes(null);
    } catch (error) {
      setErrorLikes('Something went wrong');
    }
    setIsLoadingLikes(false);
  };

  useEffect(() => {
    fetchLikes();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [post.id]);

  const handleLike = async () => {
    try {
      if (likes.includes(currentUser.id)) {
        await makeRequest.delete('/likes?postId=' + post.id);
        setLikes(likes.filter((like) => like !== currentUser.id));
      } else {
        await makeRequest.post('/likes', { postId: post.id });
        setLikes([...likes, currentUser.id]);
        socket.emit("sendText", {
          senderName: currentUser.id,
          receiverName: post.id,
          text: `${currentUser.username} like youre post.`,
        });
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await makeRequest.delete('/posts/' + post.id);
      window.location.reload();
      // Handle deletion in parent component or wherever necessary
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          <IoIosMore onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={handleDelete}>delete</button>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={post.imgs} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoadingLikes ? (
              'loading'
            ) : likes.includes(currentUser.id) ? (
              <FaHeart className="fheart" onClick={handleLike} />
            ) : (
              <FaHeart onClick={handleLike} />
            )}
            {likes?.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            {/* <TextsmsOutlinedIcon /> */}
            See Comments
          </div>
          <div className="item">
            {/* <ShareOutlinedIcon /> */}
            Share
          </div>
        </div>
        {commentOpen && <Comments socket={socket} postId={post.id} />}
      </div>
    </div>
  );
};

export default Post;
