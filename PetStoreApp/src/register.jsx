import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import axios from 'axios';

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [fnameError, setFnameError] = useState('');
  const [lnameError, setLnameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // Set initial error values to empty
    setEmailError('');
    setPasswordError('');
    setFnameError('');
    setLnameError('');
    setPhoneError('');
    setAddressError('');
    setPasswordConfirmError('');

    // Check if the user has entered all fields correctly
    if (!fname) {
      setFnameError('Please enter your First Name');
      return;
    }

    if (!lname) {
      setLnameError('Please enter your Last Name');
      return;
    }

    if (!phone) {
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

    if (phone.length !== 10) {
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

    // If all validations pass, proceed with form submission
    try {
      // Send POST request to /register endpoint
      const response = await axios.post(
        "http://" + window.location.hostname + ":"+PORT +'/register',{
        email,
        fname,
        lname,
        phonenumber,
        address,
      });

      // Handle successful registration response
      console.log(response.data); // Log success message
      navigate('/success'); // Navigate to success page or handle as needed
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
            value={phone}
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