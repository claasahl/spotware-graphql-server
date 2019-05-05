import { GraphQLServer } from "graphql-yoga";
import fs from "fs";
const typeDefs = () => {
  const buffer = fs.readFileSync("./src/schema/hello.graphql");
  return [buffer.toString()];
};

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || "World"}`
  }
};
const server = new GraphQLServer({ typeDefs, resolvers });
server.start(options =>
  console.log(`server is listening on http://localhost:${options.port}`)
);
