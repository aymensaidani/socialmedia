import { Link, useNavigate } from 'react-router-dom';
import './register.css';
import { useState } from 'react';
import axios from 'axios';
const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: '',
    email: '',
    password: '',
    name: '',
  });
  const [err, setErr] = useState(false);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/auth/register', inputs);
      navigate('/login');
    } catch (err) {
      setErr(err.rsponse.data);
    }
  };
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Welcome to our Social Media</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              name="username"
              onChange={handleChange}
              type="text"
              placeholder="Username"
            />
            <input
              name="email"
              onChange={handleChange}
              type="email"
              placeholder="Email"
            />
            <input
              name="password"
              onChange={handleChange}
              type="password"
              placeholder="Password"
            />
            <input
              name="name"
              onChange={handleChange}
              type="text"
              placeholder="Name"
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
