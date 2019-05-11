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
  event: ConnectEvent | ConnectedEvent | DisconnectEvent | DisconnectedEvent
) {
  pubsub.publish(event.session, { events: event });
}

export function connect(id: string, host: string, port: number): ConnectEvent {
  if (!clients.has(id)) {
    const socket = spotwareConnect(port, host)
      .on("end", () => publish({ type: "DisconnectedEvent", session: id }))
      .on("end", () => clients.delete(id))
      .on("secureConnect", () =>
        publish({ type: "ConnectedEvent", host, port, session: id })
      );
    clients.set(id, { socket, host, port });

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
    const event = { type: "DisconnectEvent", session: id };
    publish(event);
    return event;
  }
  throw new Error(`cannot disconnect: no client for id ${id}`);
}
