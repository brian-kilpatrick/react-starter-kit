/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

if (process.env.BROWSER) {
  throw new Error('Do not import `config.js` from inside the client-side code.');
}

export default  {

  port: process.env.PORT || 3000,
  host: process.env.WEBSITE_HOSTNAME || `localhost:${this.port}`,

  db: {
    name: process.env.DB_NAME,
    user: process.env.PGUSER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432,
    host: process.env.DB_HOST || "127.0.0.1",
  },



  // API Gateway
  api: {
    // API URL to be used in the client-side code
    clientUrl: process.env.API_CLIENT_URL || '',
    // API URL to be used in the server-side code
    serverUrl: process.env.API_SERVER_URL || `http://localhost:${process.env.PORT || 3000}`,
  },

  analytics: {

    // https://analytics.google.com/
    google: {
      trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
    },

  },

  auth: {
    secret: process.env.AUTH_SECRET || 'keeboordKizat',
    sessionMaxAge: 1000*60*60*24 // one day
  }
}

