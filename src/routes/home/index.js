import React from 'react';
import { logger } from '../../utils';

export default {

  path: '/',

  async action({fetch, user}) {
    const response = await fetch('/api/is-user?', {method: 'GET', credentials: 'include'});
    const { isUser } = await response.json();
    const loginStatus = isUser ? <p>logged in as {user.firstName} </p> : <p>Not Logged In</p>;

    return {
      title: 'React Starter Kit',
      component: <div><h1>Hello World!</h1>{loginStatus}</div>,
    };
  },

};
