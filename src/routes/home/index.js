import React from 'react';

export default {

  path: '/',

  async action() {

    return {
      title: 'React Starter Kit',
      component: <h1>Hello World!</h1>,
    };
  },

};
