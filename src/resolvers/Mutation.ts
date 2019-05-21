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
  openApiApplicationAuthReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiApplicationAuthReq(sessionId, args);
  },
  openApiAccountAuthReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAccountAuthReq(sessionId, args);
  },
  openApiVersionReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiVersionReq(sessionId, args);
  },
  openApiNewOrderReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiNewOrderReq(sessionId, args);
  },
  openApiCancelOrderReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiCancelOrderReq(sessionId, args);
  },
  openApiAmendOrderReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAmendOrderReq(sessionId, args);
  },
  openApiAmendPositionSltpReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAmendPositionSltpReq(sessionId, args);
  },
  openApiClosePositionReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiClosePositionReq(sessionId, args);
  },
  openApiAssetListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAssetListReq(sessionId, args);
  },
  openApiSymbolsListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSymbolsListReq(sessionId, args);
  },
  openApiSymbolByIdReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSymbolByIdReq(sessionId, args);
  },
  openApiSymbolsForConversionReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSymbolsForConversionReq(sessionId, args);
  },
  openApiAssetClassListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAssetClassListReq(sessionId, args);
  },
  openApiTraderReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiTraderReq(sessionId, args);
  },
  openApiReconcileReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiReconcileReq(sessionId, args);
  },
  openApiDealListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiDealListReq(sessionId, args);
  },
  openApiExpectedMarginReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiExpectedMarginReq(sessionId, args);
  },
  openApiCashFlowHistoryListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiCashFlowHistoryListReq(sessionId, args);
  },
  openApiGetAccountListByAccessTokenReq: (
    _parent,
    args,
    { sessionId, clients }
  ) => {
    return clients.openApiGetAccountListByAccessTokenReq(sessionId, args);
  },
  openApiSubscribeSpotsReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSubscribeSpotsReq(sessionId, args);
  },
  openApiUnsubscribeSpotsReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiUnsubscribeSpotsReq(sessionId, args);
  },
  openApiSubscribeLiveTrendbarReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSubscribeLiveTrendbarReq(sessionId, args);
  },
  openApiUnsubscribeLiveTrendbarReq: (
    _parent,
    args,
    { sessionId, clients }
  ) => {
    return clients.openApiUnsubscribeLiveTrendbarReq(sessionId, args);
  },
  openApiGetTrendbarsReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiGetTrendbarsReq(sessionId, args);
  },
  openApiGetTickDataReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiGetTickDataReq(sessionId, args);
  },
  openApiGetCtidProfileByTokenReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiGetCtidProfileByTokenReq(sessionId, args);
  },
  openApiSubscribeDepthQuotesReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSubscribeDepthQuotesReq(sessionId, args);
  },
  openApiUnsubscribeDepthQuotesReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiUnsubscribeDepthQuotesReq(sessionId, args);
  },
  openApiSymbolCategoryListReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiSymbolCategoryListReq(sessionId, args);
  },
  openApiAccountLogoutReq: (_parent, args, { sessionId, clients }) => {
    return clients.openApiAccountLogoutReq(sessionId, args);
  }
};
export default resolvers;
