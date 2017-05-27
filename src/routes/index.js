/* eslint-disable global-require */
import homeRoutes from './home';
import registerRoutes from './register';
import loginRoutes from './login';
import notFoundRoutes from './notFound';

// The top-level (parent) route
export default {

  path: '/',

  // Keep in mind, routes are evaluated in order
  children: [
    homeRoutes,
    registerRoutes,
    loginRoutes,
    // Wildcard routes, e.g. { path: '*', ... } (must go last)
    notFoundRoutes,
  ],

  async action({ next }) {
    // Execute each child route until one of them return the result
    const route = await next();

    // Provide default values for title, description etc.
    route.title = `${route.title || 'Untitled Page'} - www.reactstarterkit.com`;
    route.description = route.description || '';

    return route;
  },

};
