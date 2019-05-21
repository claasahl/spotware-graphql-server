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
  const commonMessages = fs.readFileSync(
    "./src/generated/schema/commonMessages.graphql"
  );
  const commonModelMessages = fs.readFileSync(
    "./src/generated/schema/commonModelMessages.graphql"
  );
  const messages = fs.readFileSync("./src/generated/schema/messages.graphql");
  const modelMessages = fs.readFileSync(
    "./src/generated/schema/modelMessages.graphql"
  );
  const payload = fs.readFileSync("./src/generated/schema/payload.graphql");
  const subscription = fs.readFileSync("./src/schema/Subscription.graphql");
  const mutation = fs.readFileSync("./src/schema/mutation.graphql");
  return [
    hello.toString(),
    subscription.toString(),
    mutation.toString(),
    commonMessages.toString(),
    commonModelMessages.toString(),
    messages.toString(),
    modelMessages.toString(),
    payload.toString()
  ];
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
