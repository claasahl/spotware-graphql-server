import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
import session from "express-session";

import resolvers from "./resolvers";
import { createContext } from "./Context";

const TMP = session({
  secret: "load from .env",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true
  }
});

const typeDefs = () => {
  const hello = fs.readFileSync("./src/schema/hello.graphql");
  const subscription = fs.readFileSync("./src/schema/Subscription.graphql");
  const mutation = fs.readFileSync("./src/schema/mutation.graphql");
  return [hello.toString(), subscription.toString(), mutation.toString()];
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: createContext
});
server.express.use(TMP);
server.start(
  {
    debug: true,
    subscriptions: {
      onConnect: async (
        _payload: any,
        _websocket: any,
        connectionContext: any
      ) => {
        return new Promise((resolve, _reject) => {
          TMP(connectionContext.request, {} as any, () => {
            resolve({ sessionID: connectionContext.request.sessionID });
          });
        });
      }
    }
  },
  options =>
    console.log(`server is listening on http://localhost:${options.port}`)
);
