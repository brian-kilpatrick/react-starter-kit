import React from 'react';
import PropTypes from 'prop-types';
import { logger } from '../../utils';
import history from '../../history';

function Login({flash}) {
    return (
      <form method="POST">
        Email: <br/>
        <input name="email" type="text" />
        <br/>
        Password: <br/>
        <input name="password" type="password" />
        <br/>
        <button type="submit">Submit</button>
        {!!flash && <p>{flash[0]}</p>}
      </form>
    )
}

export default Login;
