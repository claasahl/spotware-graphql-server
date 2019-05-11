import { MutationResolvers } from "../generated/graphql";

const resolvers: MutationResolvers = {
  connect: (_parent, args, { sessionId, clients }) => {
    const host = args.host || "live.ctraderapi.com";
    const port = args.port || 5035;
    return clients.connect(sessionId, host, port);
  },
  disconnect: (_parent, _args, { sessionId, clients }) => {
    return clients.disconnect(sessionId);
  },
  heartbeatEvent: (_parent, _args, { sessionId, clients }) => {
    return clients.heartbeatEvent(sessionId);
  },
  openApiVersionReq: (_parent, _args, { sessionId, clients }) => {
    return clients.openApiVersionReq(sessionId);
  }
};
export default resolvers;
