import BaseEntity from "../base/BaseEntity.js";

export default class User extends BaseEntity {
  #connection;
  #room = null;

  constructor({id, server, connection}) {
    super({id, server});

    this.#connection = connection;
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