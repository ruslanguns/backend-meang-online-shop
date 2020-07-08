import { IContext } from './interfaces/context.interface';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer } from 'http';
import environments from './config/environments';
import { ApolloServer, PubSub } from 'apollo-server-express';
import schema from './schema';
import expressPlayground from 'graphql-playground-middleware-express';
import Database from './lib/database';
import chalk from 'chalk';
// Configuración de las variables de entorno (lectura)
if (process.env.NODE_ENV !== 'production') {
  const env = environments;
  console.log(env);
}

async function init() {
  const app = express();

  app.use('*', cors());

  app.use(compression());

  const pubsub = new PubSub();

  const database = new Database();

  const db = await database.init();

  const context = async ({ req, connection }: IContext) => {
    const token = req ? req.headers.authorization : connection.authorization;
    return { db, token, pubsub };
  };

  const server = new ApolloServer({
    schema,
    introspection: true,
    context,
  });

  server.applyMiddleware({ app });

  app.get(
    '/',
    expressPlayground({
      endpoint: '/graphql',
    })
  );

  const httpServer = createServer(app);
  const PORT = process.env.PORT || 2002;
  server.installSubscriptionHandlers(httpServer);
  httpServer.listen(
    {
      port: PORT,
    },
    () => {
      console.log('==================SERVER API GRAPHQL====================');
      console.log(`STATUS: ${chalk.greenBright('ONLINE')}`);
      console.log(`MESSAGE: ${chalk.greenBright('API MEANG - Online Shop CONNECT!!')}`);
      console.log(`GraphQL Server running @ URL: http://localhost:${PORT} `);
      console.log(`Subscriptions ready @ ws://localhost:${PORT}${server.subscriptionsPath}`);
    }
  );
}
init();
