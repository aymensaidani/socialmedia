import { useContext, useState } from 'react';
import './navbar.css';
import { FaSearch, FaRegUser } from 'react-icons/fa';
import { IoMdNotificationsOutline, IoMdArrowDropdown } from 'react-icons/io';
import { AuthContext } from '../../context/authContext.jsx';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const { currentUser, logout } = useContext(AuthContext); // Destructure logout function from AuthContext

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleLogout = () => {
    logout()
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
          <FaSearch  className="navbar__searchIcon" />
          <input
            type="text"
            className="navbar__searchInput"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="navbar__right">
        <FaRegUser style={{color:"white"}} size={'30px'} />
        <IoMdNotificationsOutline style={{color:"white"}} className="navbar__icon" />

        <div className="navbar__user">
          <img
            src={currentUser.profilePic}
            alt=""
            className="navbar__userImage"
          />
          <IoMdArrowDropdown className='iom' style={{color:"white"}} onClick={toggleDropdown} />
          {dropdownVisible && (
            <div className="navbar__dropdown">
              <div className="navbar__dropdownOption" >
                profile
              </div>
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
