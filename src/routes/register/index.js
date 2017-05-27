import React from 'react';
import Register from './register'
import { logger } from '../../utils';

export default {
  path: '/register',

  action() {
    return {
      title: 'Create a New User',
      component: <Register />
    }
  }
}
