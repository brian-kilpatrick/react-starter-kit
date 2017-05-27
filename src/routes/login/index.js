import React from 'react';
import Login from './login';
import { logger } from '../../utils';

export default {

  path: '/login',

  action({fetch, flash}) {
    return {
      title: 'Login',
      component: <Login flash={flash} />
    }
  }
}
