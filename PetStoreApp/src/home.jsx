import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'

const Home = (props) => {
  const { loggedIn, email } = props
  const navigate = useNavigate()

  const onButtonClick = () => {
    if (loggedIn) {
        localStorage.removeItem('user')
        props.setLoggedIn(false)
    } else {
        navigate('/login')
    }
  }

  return (
    <div>
        <div>
            <Navbar />
        </div>
        <div className="mainContainer">
        <div className={'titleContainer'}>
            <div>Welcome!</div>
        </div>
        <div>This is the Login page.</div>
        <div className={'buttonContainer'}>
            <input
            className={'inputButton'}
            type="button"
            onClick={onButtonClick}
            value={loggedIn ? 'Log out' : 'Log in'}
            />
            {loggedIn ? <div>Your email address is {email}</div> : <div />}
        </div>
        </div>
    </div>
  )
}

export default Home