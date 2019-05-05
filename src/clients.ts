import {
  SpotwareSocket,
  connect as spotwareConnect
} from "@claasahl/spotware-adapter";
import {
  ConnectEvent,
  DisconnectEvent,
  ConnectedEvent,
  DisconnectedEvent
} from "./generated/graphql";
import { PubSub } from "graphql-yoga";

interface Wrapper {
  socket: SpotwareSocket;
  host: string;
  port: number;
}

export const pubsub = new PubSub();
const clients = new Map<string, Wrapper>();

function publish(
  id: string,
  event: ConnectEvent | ConnectedEvent | DisconnectEvent | DisconnectedEvent
) {
  pubsub.publish(id, { events: event });
}

export function connect(id: string, host: string, port: number): ConnectEvent {
  if (!clients.has(id)) {
    const socket = spotwareConnect(port, host)
      .on("end", () => publish(id, { type: "DisconnectedEvent" }))
      .on("end", () => clients.delete(id))
      .on("secureConnect", () =>
        publish(id, { type: "ConnectedEvent", host, port })
      );
    clients.set(id, { socket, host, port });

    const event = { type: "ConnectEvent", host, port };
    publish(id, event);
    return event;
  }
  throw new Error(`cannot connect: already a client for id ${id}`);
}

export function disconnect(id: string): DisconnectEvent {
  const wrapper = clients.get(id);
  if (wrapper) {
    wrapper.socket.end();
    const event = { type: "DisconnectEvent" };
    publish(id, event);
    return event;
  }
  throw new Error(`cannot disconnect: no client for id ${id}`);
}
