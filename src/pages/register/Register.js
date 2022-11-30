import axios from "axios";
import React, { useRef } from "react";
import "./register.css";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const username = useRef();
  const password = useRef();
  const email = useRef();
  const confirmPassword = useRef();

  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    // loginCall({email : email.current.value,password: password.current.value},dispatch)
    if (password.current.value !== confirmPassword.current.value) {
      console.log("first");
      confirmPassword.current.setCustomValidity("Password doesn't match");
    } else {
      console.log("first");
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        console.log("object");
        await axios.post("http://localhost:5000/api/auth/register", user);
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">SagarSocial</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on SagarSocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input
              type="text"
              required
              ref={username}
              placeholder="Username"
              className="loginInput"
            />
            <input
              type="email"
              required
              ref={email}
              placeholder="Email"
              className="loginInput"
            />
            <input
              type="password"
              required
              ref={password}
              placeholder="Password"
              className="loginInput"
              minLength="6"
            />
            <input
              type="password"
              required
              ref={confirmPassword}
              placeholder="Confirm Password"
              className="loginInput"
              minLength="6"
            />
            <button type="submit" className="loginButton">
              Sign Up
            </button>
            <Link to="/login">
              <button className="loginRegisterButton">Log into Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
