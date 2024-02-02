import { useContext, useEffect, useState } from 'react';
import './comments.css';
import { AuthContext } from '../../context/authContext.jsx';
import { makeRequest } from '../../axios.js';
import moment from 'moment';

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const response = await makeRequest.get(`/comments?postId=${postId}`);
      setComments(response.data);
      setError(null);
    } catch (error) {
      setError('Something went wrong');
    }
    setIsLoading(false);
  };

  console.log(currentUser,"curentuser");

  useEffect(() => {
    fetchComments();

    // Cleanup function
    return () => {
      // Any cleanup code here
    };
  }, [postId]);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await makeRequest.post('/comments', { desc, postId });
      setDesc('');
      // After successfully posting a comment, refetch comments
      fetchComments();
    } catch (error) {
      setError('Failed to post comment');
    }
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error ? (
        <div>{error}</div>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
