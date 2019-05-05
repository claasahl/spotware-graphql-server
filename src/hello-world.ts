import { GraphQLServer } from "graphql-yoga";
import fs from "fs";

import resolvers from "./resolvers";
import { createContext } from "./Context";

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
server.start({ debug: true }, options =>
  console.log(`server is listening on http://localhost:${options.port}`)
);
