import {Redirect} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class RestaurantLoginPage extends Component {
  state = {
    username: '',
    password: '',
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  loginSuccessfull = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30, path: '/'})
    history.replace('/')
  }

  loginFailure = error => {
    this.setState({errorMsg: error})
  }

  submitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const apiUrl = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.loginSuccessfull(data.jwt_token)
    } else {
      this.loginFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="restaurant-loginpage-container">
        <div className="restaurant-loginpage-responsive-container">
          <form className="form-container" onSubmit={this.submitForm}>
            <h1 className="restaurant-Title">UNI Resto Cafe</h1>

            <div className="username-password-container">
              <label htmlFor="username" className="input-label">
                USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="Username"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>

            <div className="username-password-container">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>

            <button type="submit" className="login-button">
              Login
            </button>

            {errorMsg && <p className="error_msg">{errorMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default RestaurantLoginPage
