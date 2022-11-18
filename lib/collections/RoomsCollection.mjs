import BaseCollection from "../base/BaseCollection.mjs";
import Room from "../entities/Room.mjs";

export default class RoomsCollection extends BaseCollection {
  create({me, password = null}) {
    return new Room({
      id: this._generateId(),
      server: this._server,
      owner: me,
      password
    });
  }

  /**
   * @param id
   * @return {Room}
   */
  get(id) {
    return this._contents.get(id);
  }

  toArray() {
    return [...this._contents.values()];
  }
}