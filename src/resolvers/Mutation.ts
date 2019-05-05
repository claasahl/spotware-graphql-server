import { MutationResolvers } from "../generated/graphql";

const resolvers: MutationResolvers = {
  connect: (_parent, args, { clients }) => {
    const host = args.host || "live.ctraderapi.com";
    const port = args.port || 5035;
    return clients.connect("CHANGE ME", host, port);
  },
  disconnect: (_parent, _args, { clients }) => {
    return clients.disconnect("CHANGE ME");
  }
};
export default resolvers;
