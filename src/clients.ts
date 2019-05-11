import {
  SpotwareSocket,
  connect as spotwareConnect,
  writeProtoMessage,
  toProtoMessage
} from "@claasahl/spotware-adapter";
import {
  ConnectEvent,
  DisconnectEvent,
  ConnectedEvent,
  DisconnectedEvent,
  HeartbeatEvent
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
  event: ConnectEvent | ConnectedEvent | DisconnectEvent | DisconnectedEvent
) {
  pubsub.publish(event.session, { events: event });
}

export function connect(id: string, host: string, port: number): ConnectEvent {
  if (!clients.has(id)) {
    const socket = spotwareConnect(port, host).on("secureConnect", () =>
      publish({ type: "ConnectedEvent", host, port, session: id })
    );
    const heartbeat = setInterval(
      () =>
        writeProtoMessage(
          socket,
          toProtoMessage("HEARTBEAT_EVENT", {}, CONFIG.clientMsgId())
        ),
      CONFIG.heartbeatInterval
    );
    socket
      .on("end", () => clearInterval(heartbeat))
      .on("end", () => clients.delete(id))
      .on("end", () => publish({ type: "DisconnectedEvent", session: id }))
      .on("PROTO_MESSAGE", (message, payloadType) => {
        if (payloadType === "HEARTBEAT_EVENT") {
          publish({ type: "HeartbeatEvent", session: id, ...message });
        }
      });
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
