const db = require('../db.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    
    const checkQuery = 'SELECT * FROM users WHERE email = ? OR username = ? ';
    db.query(checkQuery, [email, username], async (err, result) => {
      if (err) {
        console.error('Error checking existing user:', err);
        return res.status(500).json({err:"database errore"});
      }

      if (result && result.length > 0) {
        const existingEmail = result.find((user) => user.email === email);
        const existingUsername = result.find(
          (user) => user.username === username
        );
        const errors = [];

        if (existingEmail) {
          errors.push('Email already exists');
        }

        if (existingUsername) {
          errors.push('Username already exists');
        }

        return res.status(409).json({ message: errors.join(', ') });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery =
          'INSERT INTO users (`email`, `username`, `name`, `password`) VALUES (?,?,?,?)';

        db.query(
          insertQuery,
          [email, username, name, hashedPassword],
          (err) => {
            if (err) {
              console.error('Error registering user:', err);
              return res.status(500).json(err);
            }
            const newUser = { email, username, name, password };
            return res
              .status(200)
              .json({ message: 'User has been created', user: newUser });
          }
        );
      } catch (error) {
        console.error('Error hashing password:', error);
        return res.status(500).json(error);
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json(error);
  }
};

const login = (req, res) => {
    const checkQuery = 'SELECT * FROM users WHERE  username = ? OR email = ? ';
    db.query(checkQuery, [req.body.username , req.body.email], (err, data) => {
      if (err) return res.status(500).json(err);
      if (data.length === 0) return res.status(404).json('User not found!');
      const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
      if (!checkPassword)
        return res.status(400).json('Wrong password or username');
      const token = jwt.sign(
        {
          id: data[0].id,
        },
        'secretkey'
      );
  
      const { password,  ...others } = data[0];
      res
        .cookie('accessToken', token, {
          httpOnly: true,
        })
        .status(200)
        .json(others);
    });
  };
  
const logout = (req, res) => {
  res.clearCookie("accessToken",{
    secure: true,
    sameSite:"none"
  }).status(200).json("User has logged out")
};

module.exports = {
  register,
  login,
  logout,
};
