import { GraphQLServer, PubSub } from "graphql-yoga";
import fs from "fs";

import resolvers from "./resolvers";
import Context from "./Context";

const typeDefs = () => {
  const hello = fs.readFileSync("./src/schema/hello.graphql");
  const subscription = fs.readFileSync("./src/schema/Subscription.graphql");
  return [hello.toString(), subscription.toString()];
};

const pubsub = new PubSub();
const context: Context = { pubsub };
const server = new GraphQLServer({ typeDefs, resolvers, context });
server.start({ debug: true }, options =>
  console.log(`server is listening on http://localhost:${options.port}`)
);
