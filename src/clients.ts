import {
  SpotwareSocket,
  connect as spotwareConnect,
  writeProtoMessage,
  toProtoMessage,
  fromProtoMessage
} from "@claasahl/spotware-adapter";
import { IProtoMessage } from "@claasahl/spotware-adapter/build/spotware-messages";
import {
  ConnectEvent,
  DisconnectEvent,
  ConnectedEvent,
  DisconnectedEvent,
  HeartbeatEvent,
  OpenApiVersionReq,
  OpenApiVersionRes
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

function publish(
  event:
    | ConnectEvent
    | ConnectedEvent
    | DisconnectEvent
    | DisconnectedEvent
    | HeartbeatEvent
    | OpenApiVersionReq
    | OpenApiVersionRes
) {
  pubsub.publish(event.session, { events: event });
}

function handleProtoMessage(
  id: string,
  message: IProtoMessage,
  payloadType: string
): void {
  switch (payloadType) {
    case "PROTO_OA_VERSION_RES":
      const msg = fromProtoMessage("PROTO_OA_VERSION_RES", message);
      publish({
        ...msg.message,
        type: "OpenApiVersionRes",
        session: id,
        clientMsgId: msg.clientMsgId
      });
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

    const event = { type: "ConnectEvent", host, port, session: id };
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
    const event = { type: "DisconnectEvent", session: id };
    publish(event);
    return event;
  }
  throw new Error(`cannot disconnect: no client for id ${id}`);
}

export function heartbeatEvent(id: string): HeartbeatEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage("HEARTBEAT_EVENT", {}, clientMsgId);
    writeProtoMessage(wrapper.socket, message);
    const event = { type: "HeartbeatEvent", session: id, clientMsgId };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}

export function openApiVersionReq(id: string): OpenApiVersionReq {
  const wrapper = clients.get(id);
  if (wrapper) {
    const clientMsgId = CONFIG.clientMsgId();
    const message = toProtoMessage("PROTO_OA_VERSION_REQ", {}, clientMsgId);
    writeProtoMessage(wrapper.socket, message);
    const event = { type: "OpenApiVersionReq", session: id, clientMsgId };
    publish(event);
    return event;
  }
  throw new Error(`no client for id ${id}`);
}
