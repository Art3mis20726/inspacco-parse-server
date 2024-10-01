import app from './app';

/**
 * Start Express server.
 */
const server = app.listen(process.env['PORT'], () => {
  console.log('Parse server is running at %s', process.env['SERVER_URL']);
  console.log('GraphQL API running on http://localhost:1337/graphql');
  console.log('GraphQL Playground running on http://localhost:1337/playground');
});

export default server;
