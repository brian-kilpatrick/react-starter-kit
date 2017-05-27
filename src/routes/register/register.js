import React from 'react';
import { logger } from '../../utils';

class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      password: '',
      email: '',
      formSubmitted: false,
      errorMessage: ''
    };


  }

  _handleChange = (e) => {
    let { key } = e.target.dataset;
    let { value } = e.target;

    this.setState({[key]: value})
  };

  _handleSubmit = (e) => {
    e.preventDefault();

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    fetch('/register', {
      method: 'POST',
      headers,
      body: JSON.stringify(this.state)
    }).then(async (response) => {
      if (response.ok) {
        this.setState({formSubmitted: true})
      } else {
        let errorMessage = await response.text();
        this.setState({errorMessage})
      }
    });
  };

  render() {
    let { firstName, lastName, email, password, formSubmitted, errorMessage } = this.state;
    if (!formSubmitted) {
      return (
        <form>
          First Name:
          <br/>
          <input value={firstName} type="text" data-key="firstName" onChange={this._handleChange} />
          <br/>
          Last Name: <br/>
          <input value={lastName} type="text" data-key="lastName" onChange={this._handleChange} />
          <br/>
          Email: <br/>
          <input value={email} type="text" data-key="email" onChange={this._handleChange} />
          <br/>
          Password: <br/>
          <input value={password} type="password" data-key="password" onChange={this._handleChange} />
          <br/>
          <button onClick={this._handleSubmit}>Submit</button>
          {errorMessage && <p style={{color: 'darkred'}}>{errorMessage}</p>}
        </form>
      )
    } else {
      return <h1>User Created!</h1>
    }
  }
}

export default Register;
