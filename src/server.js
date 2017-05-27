import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import router from './router';
import models from './data/models';
import createFetch from './createFetch';
import { User } from './data/models';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import session from 'express-session';
import flash from 'connect-flash';

import { logger } from './utils';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('combined'));

//
// Authentication
// -----------------------------------------------------------------------------

//need to use a session store in prod...
app.use(session({
  secret: config.auth.secret,
  cookie: {
    maxAge: config.auth.sessionMaxAge
  }
}));

app.use(flash());

passport.serializeUser((user,done) => {
  done(null, user.id)
});

passport.deserializeUser( (id,done) => {
  User.findById(id).then((user) => {
    done(null, user.get())
  })
    .catch(() => {
      done(null, null)
    });
})

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  const user = await User.findOne({where: { email }});
  if (user) {
    const isValidPassword = await user.isValidPassword(password);
    if (isValidPassword) {
      done(null, user.get())
    } else {
      done(null, false, { message: 'Incorrect Username or Password'});
    }
  } else {
    done(null, false, { message: 'Incorrect Username'});
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
  passport.authenticate('local', {
    successFlash: 'Login Successful',
    successRedirect: '/',
    failureFlash: true,
    failureRedirect: '/login'
  })
);


app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});


// if (__DEV__) {
//   app.enable('trust proxy');
// }

app.enable('trust proxy');

app.post('/register', (req, res) => {
  User.create(req.body,{ fields: ['email', 'firstName', 'lastName', 'password']})
    .then(user => res.status(200).send(user))
    .catch(err => {
      res.status(400).send(err.message)
    });
});

app.get('/api/is-user', (req, res) => {
  res.append('Cache-Control', 'no-cache');
  res.append('Cache-Control', 'no-store');
  res.append('Pragma', 'no-cache');
  res.append('Expires', '0');
  return res.send({ isUser: !!req.user });
});

//
// Register API middleware
// -----------------------------------------------------------------------------
app.get('/api/users',(req, res) => {
  User.findAll().then((users) => res.send(users))
});


//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Universal HTTP client
      fetch: createFetch({
        baseUrl: config.api.serverUrl,
        cookie: req.headers.cookie,
      }),
      user: req.user || null
    };

    const flash = req.flash('error');

    const route = await router.resolve({
      path: req.path,
      query: req.query,
      fetch: context.fetch,
      flash
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.flash = flash;
    data.children = ReactDOM.renderToString(<App context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }
    data.app = {
      apiUrl: config.api.clientUrl,
    };

    if (req.user) {
      let { id, firstName, lastName, email } = req.user;

      data.user = { id, firstName, lastName, email };
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
models.sync().catch(err => console.error(err.stack)).then(() => {
  //remove this of course!
  // User.create({
  //   email: 'bk@bk.com',
  //   firstName: 'Test',
  //   lastName: 'Test',
  //   password: 'testPassword'
  // });

  app.listen(config.port, () => {
    console.info(`The server is running at http://localhost:${config.port}/`);
  });
});
