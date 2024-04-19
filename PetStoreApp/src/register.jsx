import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phonenumber, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [fnameError, setFnameError] = useState('');
  const [lnameError, setLnameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  const navigate = useNavigate();

  const PORT = 5273;

  function generateUserID() {
    const userID = Math.floor(100000000 + Math.random() * 900000000).toString().substring(0, 9);
    return userID;
  }

  const handleSubmit = async () => {
    // Set initial error values to empty
    setEmailError('');
    setPasswordError('');
    setFnameError('');
    setLnameError('');
    setPhoneError('');
    setAddressError('');
    setPasswordConfirmError('');
    const userID = generateUserID();

    // Check if the user has entered all fields correctly
    if (!fname) {
      setFnameError('Please enter your First Name');
      return;
    }

    if (!lname) {
      setLnameError('Please enter your Last Name');
      return;
    }

    if (!phonenumber) {
      setPhoneError('Please enter your Phone Number');
      return;
    }

    if (!address) {
      setAddressError('Please enter your Address');
      return;
    }

    if (!email) {
      setEmailError('Please enter your email');
      return;
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (!password) {
      setPasswordError('Please enter a password');
      return;
    }

    if (phonenumber.length !== 10) {
      setPhoneError('Please enter a valid 10-digit Phone Number');
      return;
    }

    if (password.length < 8) {
      setPasswordError('The password must be 8 characters or longer');
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordConfirmError('Your passwords do not match');
      return;
    }

    const requestBody = {
      userID,
      email,
      fname,
      lname,
      phonenumber,
      address,
    };
    console.log(requestBody)
    console.log(JSON.stringify(requestBody))
    try {
      const responseRegister = await fetch(`http://${window.location.hostname}:${PORT}/register`, {
        method: 'POST',
        body: JSON.stringify(requestBody),
      });

      console.log(responseRegister)

      if (!responseRegister.ok) {
        throw new Error('Registration failed');
      }

      // Handle successful registration response
      console.log("Registration successful");
      navigate('/userDashboard'); 
      
    } catch (error) {
      // Handle registration error
      console.error('Error registering user:', error);
      // Display error message to the user or handle as needed
    }
  };

  return (
    <div>
        <Navbar/>
    
        <div className={'mainContainer'}>
        <br />
        <div className={'inputContainer'}>
            <input
            value={fname}
            placeholder="Enter your First Name here"
            onChange={(ev) => setFname(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{fnameError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={lname}
            placeholder="Enter your Last Name here"
            onChange={(ev) => setLname(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{lnameError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={phonenumber}
            placeholder="Enter your Phone Number here (only numbers)"
            onChange={(ev) => setPhone(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{phoneError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={address}
            placeholder="Enter your Address"
            onChange={(ev) => setAddress(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{addressError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={email}
            placeholder="Enter your email here"
            onChange={(ev) => setEmail(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{emailError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{passwordError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input
            value={passwordConfirm}
            placeholder="Confirm your password here"
            onChange={(ev) => setPasswordConfirm(ev.target.value)}
            className={'inputBox'}
            />
            <label className="errorLabel">{passwordConfirmError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input className={'inputButton'} type="button" onClick={handleSubmit} value={'Register'} />
        </div>
        </div>
    </div>
  )
}

export default Register