import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css';
import Navbar from './components/Navbar';

const Register = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [fname, setFname] = useState ('')
  const [lname, setLname] = useState ('')
  const [phone, setPhone] = useState ('')
  const [address, setAddress] = useState ('')
  
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')
  const [fnameError, setFnameError] = useState ('')
  const [lnameError, setLnameError] = useState ('')
  const [phoneError, setPhoneError] = useState ('')
  const [addressError, setAddressError] = useState ('')
  

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')
    setFnameError('')
    setLnameError('')
    setPhoneError('')
    setAddressError('')
  
    // Check if the user has entered both fields correctly
    if ('' === fname) {
      setFnameError('Please enter your First Name')
      return
    }

    if ('' === lname) {
      setLnameError('Please enter your Last Name')
      return
    }

    if ('' === phone) {
      setPhoneError('Please enter your Phone Number')
      return
    }

    if ('' === address) {
      setPhoneError('Please enter your Address')
      return
    }

    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }
  
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }
  
    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }

    if (phone.length != 10) {
      setPasswordError('Please only enter the numbers')
      return
    }
  
    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }

    if (password != passwordConfirm) {
      setPasswordConfirmError('Your passwords do not match')
      return
    }
  
  }

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
            className={'inputBox'}
            />
            <label className="errorLabel">{passwordConfirmError}</label>
        </div>
        <br />
        <div className={'inputContainer'}>
            <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Register'} />
        </div>
        </div>
    </div>
  )
}

export default Register