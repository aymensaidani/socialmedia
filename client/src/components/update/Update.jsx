import { useContext, useState } from 'react';
import { makeRequest } from '../../axios';
import './update.css';
import { FaCloudDownloadAlt } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

const Update = ({ setOpenUpdate, user }) => {
  const { updateProfilePic } = useContext(AuthContext);

  const [cover, setCover] = useState('');
  const [profile, setProfile] = useState('');
  const [texts, setTexts] = useState({
    email: user.email || '',
    password: user.password || '',
    name: user.name || '',
    city: user.city || '',
  });

  const handleImageChange = (e, setImage) => {
    setImage(e.target.files[0]);
  };

  const handleImageUpload = async (file) => {
    const form = new FormData();
    form.append('file', file);
    form.append('upload_preset', 'cosmiticProd');

    try {
      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dgcdmrj7x/image/upload',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data' 
          }
        }
      );

      return response.data.secure_url;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    let coverUrl = cover ? await handleImageUpload(cover) : user.coverPic;
    let profileUrl = profile ? await handleImageUpload(profile) : user.profilePic;

    try {
      await makeRequest.put('/users', {
        ...texts,
        coverPic: coverUrl,
        profilePic: profileUrl,
      });
      window.location.reload();
      updateProfilePic(profileUrl);

      setOpenUpdate(false);
      setCover(null);
      setProfile(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={cover ? URL.createObjectURL(cover) : user.coverPic}
                  alt=""
                />
                <FaCloudDownloadAlt className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, setCover)}
            />
            <label htmlFor="profile">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={profile ? URL.createObjectURL(profile) : user.profilePic}
                  alt=""
                />
                <FaCloudDownloadAlt className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: 'none' }}
              onChange={(e) => handleImageChange(e, setProfile)}
            />
          </div>
          <label>Email</label>
          <input
            type="text"
            value={texts.email}
            name="email"
            onChange={handleChange}
          />
          <label>Password</label>
          <input
            type="text"
            value={texts.password}
            name="password"
            onChange={handleChange}
          />
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />

          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
