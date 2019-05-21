import {
  SpotwareSocket,
  connect as spotwareConnect,
  writeProtoMessage,
  toProtoMessage,
  fromProtoMessage
} from "@claasahl/spotware-adapter";
import {
  IProtoMessage,
  ProtoOAPayloadType,
  ProtoPayloadType,
  IProtoHeartbeatEvent,
  IProtoOAVersionReq,
  IProtoOAAccountLogoutReq,
  IProtoOASymbolCategoryListReq,
  IProtoOAUnsubscribeDepthQuotesReq,
  IProtoOASubscribeDepthQuotesReq,
  IProtoOAGetCtidProfileByTokenReq,
  IProtoOAGetTickDataReq,
  IProtoOAGetTrendbarsReq,
  IProtoOAUnsubscribeLiveTrendbarReq,
  IProtoOASubscribeLiveTrendbarReq,
  IProtoOAUnsubscribeSpotsReq,
  IProtoOASubscribeSpotsReq,
  IProtoOAGetAccountListByAccessTokenReq,
  IProtoOACashFlowHistoryListReq,
  IProtoOAExpectedMarginReq,
  IProtoOADealListReq,
  IProtoOAReconcileReq,
  IProtoOATraderReq,
  IProtoOAAssetClassListReq,
  IProtoOASymbolsForConversionReq,
  IProtoOASymbolByIdReq,
  IProtoOASymbolsListReq,
  IProtoOAAssetListReq,
  IProtoOAClosePositionReq,
  IProtoOAAmendPositionSLTPReq,
  IProtoOAAmendOrderReq,
  IProtoOACancelOrderReq,
  IProtoOANewOrderReq,
  IProtoOAAccountAuthReq,
  IProtoOAApplicationAuthReq
} from "@claasahl/spotware-adapter/build/spotware-messages";
import {
  ConnectEvent,
  DisconnectEvent,
  SpotwareMessageEvent,
  Events,
  Payload
} from "./generated/graphql";
import { PubSub } from "graphql-yoga";

import CONFIG from "./config";

interface Wrapper {
  socket: SpotwareSocket;
  host: string;
  port: number;
  heartbeat: NodeJS.Timeout;
}

export const pubsub = new PubSub();
const clients = new Map<string, Wrapper>();

function publish(event: Events) {
  pubsub.publish(event.session, { events: event });
}

function handleProtoMessage(
  id: string,
  message: IProtoMessage,
  payloadType: string
): void {
  switch (payloadType) {
    case "PROTO_OA_VERSION_RES":
      const eventName = "PROTO_OA_VERSION_RES";
      const msg = fromProtoMessage(eventName, message);
      const event: SpotwareMessageEvent = {
        type: "SpotwareMessageEvent",
        session: id,
        payloadType: message.payloadType,
        payload: {
          ...msg.message,
          payloadType: eventName
        },
        clientMsgId: msg.clientMsgId
      };
      publish(event);
  }
}

export function connect(id: string, host: string, port: number): ConnectEvent {
  if (!clients.has(id)) {
    const socket = spotwareConnect(port, host).on("secureConnect", () =>
      publish({ type: "ConnectedEvent", host, port, session: id })
    );
    const heartbeat = setInterval(
      () => heartbeatEvent(id),
      CONFIG.heartbeatInterval
    );
    socket
      .on("end", () => clearInterval(heartbeat))
      .on("end", () => clients.delete(id))
      .on("end", () => publish({ type: "DisconnectedEvent", session: id }))
      .on("PROTO_MESSAGE", (message, payloadType) =>
        handleProtoMessage(id, message, payloadType)
      );
    clients.set(id, { socket, host, port, heartbeat });

    const event: ConnectEvent = {
      type: "ConnectEvent",
      host,
      port,
      session: id
    };
    publish(event);
    return event;
  }
  throw new Error(`cannot connect: already a client for id ${id}`);
}

export function disconnect(id: string): DisconnectEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    wrapper.socket.end();
    clearInterval(wrapper.heartbeat);
    const event: DisconnectEvent = { type: "DisconnectEvent", session: id };
    publish(event);
    return event;
  }
  throw new Error(`cannot disconnect: no client for id ${id}`);
}

export function heartbeatEvent(id: string): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoPayloadType.HEARTBEAT_EVENT;
    const eventName = "HEARTBEAT_EVENT";
    const payload: IProtoHeartbeatEvent = { payloadType };
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(eventName, payload, clientMsgId);
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}
export function openApiApplicationAuthReq(
  id: string,
  payload: IProtoOAApplicationAuthReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_APPLICATION_AUTH_REQ;
    const eventName = "PROTO_OA_APPLICATION_AUTH_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAccountAuthReq(
  id: string,
  payload: IProtoOAAccountAuthReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_ACCOUNT_AUTH_REQ;
    const eventName = "PROTO_OA_ACCOUNT_AUTH_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiVersionReq(
  id: string,
  payload: IProtoOAVersionReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_VERSION_REQ;
    const eventName = "PROTO_OA_VERSION_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiNewOrderReq(
  id: string,
  payload: IProtoOANewOrderReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_NEW_ORDER_REQ;
    const eventName = "PROTO_OA_NEW_ORDER_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiCancelOrderReq(
  id: string,
  payload: IProtoOACancelOrderReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_CANCEL_ORDER_REQ;
    const eventName = "PROTO_OA_CANCEL_ORDER_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAmendOrderReq(
  id: string,
  payload: IProtoOAAmendOrderReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_AMEND_ORDER_REQ;
    const eventName = "PROTO_OA_AMEND_ORDER_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAmendPositionSltpReq(
  id: string,
  payload: IProtoOAAmendPositionSLTPReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_AMEND_POSITION_SLTP_REQ;
    const eventName = "PROTO_OA_AMEND_POSITION_SLTP_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiClosePositionReq(
  id: string,
  payload: IProtoOAClosePositionReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_CLOSE_POSITION_REQ;
    const eventName = "PROTO_OA_CLOSE_POSITION_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAssetListReq(
  id: string,
  payload: IProtoOAAssetListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_ASSET_LIST_REQ;
    const eventName = "PROTO_OA_ASSET_LIST_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSymbolsListReq(
  id: string,
  payload: IProtoOASymbolsListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SYMBOLS_LIST_REQ;
    const eventName = "PROTO_OA_SYMBOLS_LIST_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSymbolByIdReq(
  id: string,
  payload: IProtoOASymbolByIdReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SYMBOL_BY_ID_REQ;
    const eventName = "PROTO_OA_SYMBOL_BY_ID_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSymbolsForConversionReq(
  id: string,
  payload: IProtoOASymbolsForConversionReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SYMBOLS_FOR_CONVERSION_REQ;
    const eventName = "PROTO_OA_SYMBOLS_FOR_CONVERSION_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAssetClassListReq(
  id: string,
  payload: IProtoOAAssetClassListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_ASSET_CLASS_LIST_REQ;
    const eventName = "PROTO_OA_ASSET_CLASS_LIST_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiTraderReq(
  id: string,
  payload: IProtoOATraderReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_TRADER_REQ;
    const eventName = "PROTO_OA_TRADER_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiReconcileReq(
  id: string,
  payload: IProtoOAReconcileReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_RECONCILE_REQ;
    const eventName = "PROTO_OA_RECONCILE_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiDealListReq(
  id: string,
  payload: IProtoOADealListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_DEAL_LIST_REQ;
    const eventName = "PROTO_OA_DEAL_LIST_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiExpectedMarginReq(
  id: string,
  payload: IProtoOAExpectedMarginReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_EXPECTED_MARGIN_REQ;
    const eventName = "PROTO_OA_EXPECTED_MARGIN_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiCashFlowHistoryListReq(
  id: string,
  payload: IProtoOACashFlowHistoryListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_CASH_FLOW_HISTORY_LIST_REQ;
    const eventName = "PROTO_OA_CASH_FLOW_HISTORY_LIST_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiGetAccountListByAccessTokenReq(
  id: string,
  payload: IProtoOAGetAccountListByAccessTokenReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType =
      ProtoOAPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ;
    const eventName = "PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSubscribeSpotsReq(
  id: string,
  payload: IProtoOASubscribeSpotsReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SUBSCRIBE_SPOTS_REQ;
    const eventName = "PROTO_OA_SUBSCRIBE_SPOTS_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiUnsubscribeSpotsReq(
  id: string,
  payload: IProtoOAUnsubscribeSpotsReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_UNSUBSCRIBE_SPOTS_REQ;
    const eventName = "PROTO_OA_UNSUBSCRIBE_SPOTS_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSubscribeLiveTrendbarReq(
  id: string,
  payload: IProtoOASubscribeLiveTrendbarReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_REQ;
    const eventName = "PROTO_OA_SUBSCRIBE_LIVE_TRENDBAR_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiUnsubscribeLiveTrendbarReq(
  id: string,
  payload: IProtoOAUnsubscribeLiveTrendbarReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType =
      ProtoOAPayloadType.PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_REQ;
    const eventName = "PROTO_OA_UNSUBSCRIBE_LIVE_TRENDBAR_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiGetTrendbarsReq(
  id: string,
  payload: IProtoOAGetTrendbarsReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_GET_TRENDBARS_REQ;
    const eventName = "PROTO_OA_GET_TRENDBARS_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiGetTickDataReq(
  id: string,
  payload: IProtoOAGetTickDataReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_GET_TICKDATA_REQ;
    const eventName = "PROTO_OA_GET_TICKDATA_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiGetCtidProfileByTokenReq(
  id: string,
  payload: IProtoOAGetCtidProfileByTokenReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType =
      ProtoOAPayloadType.PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_REQ;
    const eventName = "PROTO_OA_GET_CTID_PROFILE_BY_TOKEN_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSubscribeDepthQuotesReq(
  id: string,
  payload: IProtoOASubscribeDepthQuotesReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_REQ;
    const eventName = "PROTO_OA_SUBSCRIBE_DEPTH_QUOTES_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiUnsubscribeDepthQuotesReq(
  id: string,
  payload: IProtoOAUnsubscribeDepthQuotesReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType =
      ProtoOAPayloadType.PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_REQ;
    const eventName = "PROTO_OA_UNSUBSCRIBE_DEPTH_QUOTES_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiSymbolCategoryListReq(
  id: string,
  payload: IProtoOASymbolCategoryListReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_SYMBOL_CATEGORY_REQ;
    const eventName = "PROTO_OA_SYMBOL_CATEGORY_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiAccountLogoutReq(
  id: string,
  payload: IProtoOAAccountLogoutReq
): SpotwareMessageEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const payloadType = ProtoOAPayloadType.PROTO_OA_ACCOUNT_LOGOUT_REQ;
    const eventName = "PROTO_OA_ACCOUNT_LOGOUT_REQ";
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage(
      eventName,
      { ...payload, payloadType },
      clientMsgId
    );
    writeProtoMessage(wrapper.socket, message);
    const event: SpotwareMessageEvent = {
      type: "SpotwareMessageEvent",
      session: id,
      payloadType,
      payload: {
        ...payload,
        payloadType: eventName
      },
      clientMsgId
    };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}
