import React, { useContext, useState } from 'react';
import './publication.css';
import Image from '../../assets/img.png';

import { AuthContext } from '../../context/authContext.jsx';
import { makeRequest } from '../../axios.js';
import axios from 'axios';

const Publication = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState('');
  const [uploading, setUploading] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleClick = async () => {
    try {
      setUploading(true);

      let imgUrl = '';
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'cosmiticProd');
        const uploadResponse = await axios.post(
          'https://api.cloudinary.com/v1_1/dgcdmrj7x/image/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data' 
            }
          }
        )
        imgUrl = uploadResponse.data.secure_url;
      }

      await makeRequest.post('/posts', { desc, img: imgUrl });
      setDesc('');
      setFile(null);
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="publication">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            id="desc"
            placeholder={`What's on your mind, ${currentUser.name}?`}
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />
        </div>
        <div className="right">
          {file && (
            <img className="file" alt="" src={URL.createObjectURL(file)} />
          )}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="item">
              <img src={Image} alt="" />
              <span>Add Image</span>
            </label>
          </div>
          <div className="right">
            <button onClick={handleClick} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publication;
