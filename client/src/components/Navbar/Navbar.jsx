import React, { useContext, useEffect, useState } from 'react';
import './navbar.css';
import { FaSearch, FaRegUser, FaTimes } from 'react-icons/fa'; // Import FaTimes for close icon
import { IoMdNotificationsOutline, IoMdArrowDropdown } from 'react-icons/io';
import { AuthContext } from '../../context/authContext.jsx';
import { Link } from 'react-router-dom';
import notificationSound from '../../assets/notsound.mp3';
import axios from 'axios';
import { makeRequest } from '../../axios.js';

const Navbar = ({ socket, search }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { currentUser, logout } = useContext(AuthContext);
  const [notificationLikes, setNotificationLikes] = useState(0);
  const [showNotificationsLikes, setShowNotificationsLikes] = useState(false);

  const [notificationFollower, setNotificationFollower] = useState(0);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const [notificationMessages, setNotificationMessages] = useState([]);
  const [showNotificationsFollower, setShowNotificationsFollower] =
    useState(false);

  useEffect(() => {
    const handleText = (data) => {
      const notificationData = Array.isArray(data.text)
        ? data.text
        : [data.text];
      setNotificationFollower(
        (prevCount) => prevCount + notificationData.length
      );
      setPlayNotificationSound(true);
      setNotificationMessages((prevMessages) => [
        ...prevMessages,
        ...notificationData,
      ]);
    };

    if (socket) {
      socket.on('getText', handleText);
    }

    return () => {
      if (socket) {
        socket.off('getText', handleText);
      }
    };
  }, [socket]);

  useEffect(() => {
    if (playNotificationSound) {
      const audio = new Audio(notificationSound);
      audio.play();
      setPlayNotificationSound(false);
    }
  }, [playNotificationSound]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    logout();
  };

  const handleShowNotifications = () => {
    setShowNotificationsFollower(true);
    setNotificationFollower(0);
  };

  const handleCloseNotifications = () => {
    setShowNotificationsFollower(false);
  };
  /////////////////// serch for users ///////
  const [originalData, setOriginalData] = useState([]); // Store original data fetched from the server
  const [filteredData, setFilteredData] = useState([]); // Store filtered data based on search input

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await makeRequest.get('/users/all');
        setOriginalData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const filterData = (inputValue) => {
    if (inputValue.trim() === '') {
      setFilteredData(originalData); // Reset to original data when search input is empty
    } else {
      setFilteredData(
        originalData.filter((user) =>
          user.name.toLowerCase().includes(inputValue)
        )
      );
    }
  };
  const handleInputChange = (e) => {
    const inputValue = e.target.value.toLowerCase();
    setSearchInput(inputValue);
    filterData(inputValue);
  };

  ////////////////////////////

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" style={{ textDecoration: 'none' }}>
          <span className="navbar__logo">SocialMedia</span>
        </Link>
      </div>
      <div className="navbar__center">
        <div className="navbar__search">
          <FaSearch className="navbar__searchIcon" />
          <input
            type="text"
            className="navbar__searchInput"
            placeholder="Search"
            value={searchInput}
            onChange={handleInputChange}
          />
        </div>

        {searchInput && (
          <div className="filteredUsernamesContainer">
            <div className="filteredUsernames">
              {filteredData.map((user) => (
                <Link
                  key={user.id}
                  to={`/profile/${user.id}`}
                  className="userLink"
                >
                  <div className="username">{user.name}</div>
                  <img src={user.profilePic} alt="" className="profilePic" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="navbar__right">
        <div style={{ position: 'relative' }}>
          <IoMdNotificationsOutline
            style={{ color: 'white' }}
            className="navbar__icon"
          />
        </div>

        <div style={{ position: 'relative' }}>
          <FaRegUser
            style={{ color: 'white' }}
            size={'30px'}
            onClick={handleShowNotifications}
          />
          {showNotificationsFollower && (
            <div className="notification-dropdown">
              <FaTimes
                className="close-icon"
                onClick={handleCloseNotifications}
              />{' '}
              {/* Close icon */}
              {notificationMessages.map((message, index) => (
                <div key={index}>{message}</div>
              ))}
            </div>
          )}

          {notificationFollower > 0 && (
            <div className="badge" onClick={handleShowNotifications}>
              {notificationFollower}
            </div>
          )}
        </div>
        <div className="navbar__user">
          <img
            src={currentUser.profilePic}
            alt=""
            className="navbar__userImage"
          />
          <IoMdArrowDropdown
            className="iom"
            style={{ color: 'white' }}
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="navbar__dropdown">
              <Link to={`/profile/${currentUser.id}`}>
                <div className="navbar__dropdownOption">Profile</div>
              </Link>
              <div className="navbar__dropdownOption" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
