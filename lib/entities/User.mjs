import BaseEntity from "../base/BaseEntity.mjs";
import MessageParser from "../messages/MessageParser.mjs";
import RoomCreateReply from "../messages/out/RoomCreateReply.mjs";
import ErrorReply from "../messages/out/ErrorReply.mjs";
import RoomListReply from "../messages/out/RoomListReply.mjs";
import EventEmitter from "events";

export default class User extends BaseEntity {
  /** @type {import('@fastify/websocket').SocketStream} */
  #connection;
  /** @type {Room|null} */
  #room = null;
  #messagesEmitter = new EventEmitter();

  /**
   * @param {string} id
   * @param {Server} server
   * @param {import('@fastify/websocket').SocketStream} connection
   */
  constructor({id, server, connection}) {
    super({id, server});

    this.#connection = connection;

    this.#connection.socket.addEventListener("message", (message) => {
      this.#parseMessage(message.data)
    });

    this.#connection.socket.addEventListener('close', () => {
      this.#messagesEmitter.removeAllListeners();
      this.#messagesEmitter = new EventEmitter();
    })

    this.#route();
  }

  #parseMessage(content) {
    /** @type {BaseMessage|null} */
    const message = MessageParser.parse(content);

    if (!message)
      return;

    this.#messagesEmitter.emit(`message:${message.type}`, message);
  }

  /**
   * @template {keyof BackendMessageTypes} MessageType
   * @param {MessageType|string} type
   * @param {(message: BackendMessageTypes[MessageType]) => *} callback
   */
  onMessage(type, callback) {
    this.#messagesEmitter.on(`message:${type}`, callback);
  }

  #route() {
    this.onMessage("listRooms", message => {
      this.#connection.socket.send(
        new RoomListReply({rooms: this._server.rooms.toArray()})
          .toString()
      );
    })

    this.onMessage("createRoom", message => {
      try {
        this.#createRoom({password: message.password});
      } catch (e) {
        this.#connection.socket.send(
          new ErrorReply({message: e.message}).toString()
        );
      }

      this.#connection.socket.send(
        new RoomCreateReply({roomId: this.#room.id})
          .toString()
      );
    });
  }

  #createRoom({password = null}) {
    if (this.#room)
      throw new Error("User already in a room!");

    this.#room = this._server.rooms.create({me: this, password});
  }

  #joinRoom({id, password = null}) {
    if (this.#room)
      throw new Error("User already in a room!");

    const room = this._server.rooms.get(id);

    if (!room)
      throw new Error("Room not found!");

    room.join({me: this, password});

    this.#room = room;
  }

  #leaveRoom() {
    if (!this.#room)
      throw new Error("User not in a room!");

    this.#room.leave({me: this});

    this.#room = null;
  }

  /**
   * @param {User} me
   * @param {Room} from
   */
  emitForceLeave({me, from}) {
    if (!this.#room) {
      throw new Error("User not in a room!");
    }

    if (this.#room !== from) {
      throw new Error("User not in this room!");
    }

    if (me !== from.owner) {
      throw new Error("User is not the room owner!");
    }

    this.#room = null;
  }
}