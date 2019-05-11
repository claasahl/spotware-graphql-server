import { PayloadResolvers } from "../generated/graphql";

const resolvers: PayloadResolvers = {
  __resolveType: parent => {
    return "OpenApiVersionRes";
  }
};

export default resolvers;
