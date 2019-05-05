import { GraphQLServer } from "graphql-yoga";
import fs from "fs";

import { Resolvers } from "./generated/graphql";
import { IResolvers } from "graphql-tools";

const typeDefs = () => {
  const buffer = fs.readFileSync("./src/schema/hello.graphql");
  return [buffer.toString()];
};

const resolvers: Resolvers & IResolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`
  }
};
const server = new GraphQLServer({ typeDefs, resolvers: resolvers });
server.start(options =>
  console.log(`server is listening on http://localhost:${options.port}`)
);
