import { PayloadResolvers } from "../generated/graphql";

const resolvers: PayloadResolvers = {
  __resolveType: () => "HeartbeatEvent"
};

export default resolvers;
