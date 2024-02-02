import './profile.css';
// import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
// import LinkedInIcon from "@mui/icons-material/LinkedIn";
// import InstagramIcon from "@mui/icons-material/Instagram";
// import PinterestIcon from "@mui/icons-material/Pinterest";
// import TwitterIcon from "@mui/icons-material/Twitter";
// import PlaceIcon from "@mui/icons-material/Place";
// import LanguageIcon from "@mui/icons-material/Language";
// import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from '../../components/posts/Posts';
import { AuthContext } from '../../context/authContext.jsx';
import { makeRequest } from '../../axios.js';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Update from '../../components/update/Update.jsx';

const Profile = ({socket}) => {
  console.log(socket);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [relationshipData, setRelationshipData] = useState([]);
  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);
  const userId = parseInt(useLocation().pathname.split('/')[2]);
  console.log(userId, 'userid in profile');
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const userResponse = await makeRequest.get('/users/getOne/' + userId);
        const relationshipResponse = await makeRequest.get(
          '/relationships?followedUserId=' + userId
        );
        setData(userResponse.data);
        setRelationshipData(relationshipResponse.data);
        setIsLoading(false);
      } catch (error) {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleFollow = async () => {
    try {
      const following = relationshipData.includes(currentUser.id);
      if (following) {
        await makeRequest.delete('/relationships?userId=' + userId);
        setRelationshipData(
          relationshipData.filter((id) => id !== currentUser.id)
        );
      } else {
        await makeRequest.post('/relationships', { userId });
        setRelationshipData([...relationshipData, currentUser.id]);
         // Send socket message when a user follows another user
      socket.emit("sendText", {
        senderName: currentUser.id,
        receiverName: userId,
        text: `The  ${currentUser.username} is now following you.`,
      });
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  return (
    <div className="profile">
      {isLoading ? (
        'Loading...'
      ) : error ? (
        <div>{error}</div>
      ) : (
        <>
          <div className="images">
            <img src={data.coverPic} alt="" className="cover" />
            <img src={data.profilePic} alt="" className="profilePic" />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="center">
                <span>{data.name}</span>

                {userId === currentUser.id ? (
                  <button onClick={() => setOpenUpdate(true)}>Update</button>
                ) : (
                  <button onClick={handleFollow}>
                    {relationshipData.includes(currentUser.id)
                      ? 'Following'
                      : 'Follow'}
                  </button>
                )}
              </div>
              {/* <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div> */}
            </div>
            <Posts userId={userId} data={data} />
          </div>
        </>
      )}
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
