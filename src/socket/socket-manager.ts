import type { Socket } from "socket.io-client";
import { getStoredToken } from "../common/utils/authStorage";
import { getSocketClient } from "./socket-client";
import type { SocketAck } from "./socket-types";

type EventHandler<T> = (payload: T) => void;

class SocketManager {
  private socket: Socket;
  private trackedRequests = new Map<
    string,
    { event: string; payload: Record<string, unknown> }
  >();

  constructor() {
    this.socket = getSocketClient();
    this.socket.on("connect", () => {
      this.rejoinEvents();
    });
  }

  public connect() {
    const token = getStoredToken();
    this.socket.auth = {
      ...(typeof this.socket.auth === "object" ? this.socket.auth : {}),
      token: token ? `Bearer ${token}` : undefined,
    };

    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public emit<TPayload, TAck>(
    event: string,
    payload: TPayload,
  ): Promise<SocketAck<TAck>> {
    return new Promise((resolve, reject) => {
      this.connect();
      this.socket.timeout(10000).emit(
        event,
        payload,
        (error: Error | null, response: SocketAck<TAck>) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(response);
        },
      );
    });
  }

  public subscribe<TPayload>(
    event: string,
    handler: EventHandler<TPayload>,
  ): () => void {
    const wrappedHandler = (payload: TPayload) => {
      handler(payload);
    };

    this.socket.on(event, wrappedHandler);

    return () => {
      this.socket.off(event, wrappedHandler);
    };
  }

  public async trackRequest(
    key: string,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    this.trackedRequests.set(key, { event, payload });
    const response = await this.emit<Record<string, unknown>, null>(
      event,
      payload,
    );

    if (!response.success) {
      throw new Error(response.message || `Failed to emit ${event}`);
    }
  }

  public async untrackRequest(
    key: string,
    event: string,
    payload: Record<string, unknown>,
  ): Promise<void> {
    this.trackedRequests.delete(key);
    const response = await this.emit<Record<string, unknown>, null>(
      event,
      payload,
    );

    if (!response.success) {
      throw new Error(response.message || `Failed to emit ${event}`);
    }
  }

  private rejoinEvents() {
    this.trackedRequests.forEach(({ event, payload }) => {
      this.socket.emit(event, payload);
    });
  }
}

export const socketManager = new SocketManager();
