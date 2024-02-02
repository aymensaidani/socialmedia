import { useContext, useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/authContext.jsx';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: '',
    // email: '',
    password: '',
  });
  const [err, setErr] = useState(false);
  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/")
    } catch (err) {
      // Check if error object exists and has a response property
      if (err && err.response && err.response.data) {
        // Access the error message from the response data
        setErr(err.response.data);
      } else {
        // If error object or response data is undefined, set a generic error message
        setErr("An error occurred while logging in.");
      }
    }
  };
  
  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello World.</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero cum,
            alias totam numquam ipsa exercitationem dignissimos, error nam,
            consequatur.
          </p>
          <span>Dont you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input
              onChange={handleChange}
              name='username'
              type="text"
              id="username"
              autoComplete="username"
              placeholder="Username or Email"
            />
            <input
              onChange={handleChange}
              name='password'
              type="password"
              placeholder="Password"
            />
            {err && err}
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
