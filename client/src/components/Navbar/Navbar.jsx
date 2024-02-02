import { useContext, useEffect, useState } from 'react';
import './navbar.css';
import { FaSearch, FaRegUser } from 'react-icons/fa';
import { IoMdNotificationsOutline, IoMdArrowDropdown } from 'react-icons/io';
import { AuthContext } from '../../context/authContext.jsx';
import { Link } from 'react-router-dom';
import notificationSound from '../../assets/notsound.mp3'; // Import your notification sound file

const Navbar = ({ socket }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { currentUser, logout } = useContext(AuthContext);

  const [notificationFollower, setNotificationFollower] = useState(0);
  const [playNotificationSound, setPlayNotificationSound] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);

  useEffect(() => {
    const handleText = (data) => {
      const notificationData = Array.isArray(data.text) ? data.text : [data.text];
      setNotificationFollower(prevCount => prevCount + notificationData.length);
      setPlayNotificationSound(true);
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

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

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
          <Link to={`/profile/${searchInput}`} className="searchLink">
            Go to {searchInput}'s profile
          </Link>
        )}
      </div>
      <div className="navbar__right">
        <div style={{ position: 'relative' }}>
          <IoMdNotificationsOutline style={{ color: 'white' }} className="navbar__icon" />
        </div>
        <div style={{ position: 'relative' }}>
          <FaRegUser style={{ color: 'white' }} size={'30px'} />
          {notificationFollower > 0 && <div className="badge">{notificationFollower}</div>}
        </div>
        <div className="navbar__user">
          <img src={currentUser.profilePic} alt="" className="navbar__userImage" />
          <IoMdArrowDropdown
            className="iom"
            style={{ color: 'white' }}
            onClick={toggleDropdown}
          />
          {dropdownVisible && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdownOption">Profile</div>
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
