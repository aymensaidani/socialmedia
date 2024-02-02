import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
export const AuthContext = createContext();

// import axios from "axios ";

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const login = async (inputs) => {
    //TO DO
    const res = await axios.post(
      'http://localhost:3001/api/auth/login',
      inputs,
      {
        withCredentials: true,
      }
    );
    setCurrentUser(res.data);
  };
  const updateProfilePic = (newProfilePic) => {
    setCurrentUser((prevUser) => ({ ...prevUser, profilePic: newProfilePic }));
    // Update user data in local storage if necessary
    localStorage.setItem('user', JSON.stringify({ ...currentUser, profilePic: newProfilePic }));
  };

  const logout = async () => {
    try {
      await axios.get('http://localhost:3001/api/auth/logout', {
        withCredentials: true,
      });
      setCurrentUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, updateProfilePic, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
