import BaseEntity from "../base/BaseEntity.mjs";
import crypto from "crypto";

export default class Room extends BaseEntity {
  /** @type {User} */
  #owner;
  /** @type {string|null} */
  #password = null;
  /** @type {Set<User>} */
  #participants = new Set();
  #closed = false;

  /**
   * @param {string} id
   * @param {Server} server
   * @param {User} owner
   * @param {string|null} password
   */
  constructor({id, server, owner, password}) {
    super({id, server});

    if (password && password.length) {
      this.#password = this.#calculateHash(password);
    }

    this.#owner = owner;

    this.#participants.add(owner);
  }

  /**
   * @param {string} password
   * @return {string}
   */
  #calculateHash(password) {
    return crypto
      .createHash("sha256")
      .update(
        this._id
          .concat(Room.#saltSeparator)
          .concat(password)
      )
      .digest("base64url");
  }

  get owner() {
    return this.#owner;
  }

  get locked() {
    return !!this.#password;
  }

  /**
   * @param {User} me
   * @param {User} to
   */
  assignOwner({me, to}) {
    if (this.#closed)
      throw new Error("The room is closed!");

    if (this.#owner !== me)
      throw new Error("Only the owner can assign ownership!");

    if (!this.#participants.has(to))
      throw new Error("The user is not in the room!");

    this.#owner = to;
  }

  /**
   * @param {User} me
   * @param {string} password
   */
  setPassword({me, password}) {
    if (this.#closed)
      throw new Error("The room is closed!");

    if (this.#owner !== me)
      throw new Error("Only the owner can set the password!");

    if (password && password.length) {
      this.#password = this.#calculateHash(password);
    } else {
      this.#password = null;
    }
  }

  /**
   * @param {User} me
   * @param {string|null} password
   */
  join({me, password = null}) {
    if (this.#closed)
      throw new Error("The room is closed!");

    if (this.#owner === me)
      throw new Error("The owner cannot join their own room!");

    if (this.#participants.has(me))
      throw new Error("The user is already in the room!");

    if (this.#participants.size >= Room.#maxRoomSize) {
      throw new Error("The room is full!");
    }

    if (this.#password && this.#password.length) {
      if (!password)
        throw new Error("The room is locked!");

      if (this.#calculateHash(password) !== this.#password)
        throw new Error("Invalid password!");
    }

    this.#participants.add(me);
  }

  /**
   * @param {User} me
   */
  leave({me}) {
    if (this.#closed)
      throw new Error("The room is closed!");

    if (this.#owner === me)
      throw new Error("The owner cannot leave their own room!");

    if (!this.#participants.has(me))
      throw new Error("The user is not in the room!");

    this.#participants.delete(me);
  }

  /**
   * @param {User} me
   */
  close({me}) {
    if (this.#closed)
      throw new Error("The room is already closed!");

    if (this.#owner !== me)
      throw new Error("Only the owner can close the room!");

    this.#closed = true;

    this.#participants.forEach(user => {
      user.emitForceLeave({me, from: this});
    });

    this.#participants.clear();
  }

  static #saltSeparator = '||';
  static #maxRoomSize = 5;
}