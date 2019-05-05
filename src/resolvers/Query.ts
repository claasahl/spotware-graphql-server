import { QueryResolvers } from "../generated/graphql";

const resolvers: QueryResolvers = {
  hello: (_, { name }) => `Hello ${name || "World"}`
};
export default resolvers;
