import User from "../entities/User.mjs";
import BaseCollection from "../base/BaseCollection.mjs";

export default class UsersCollection extends BaseCollection {
  create(connection) {
    const user = new User({
      id: this._generateId(),
      server: this._server,
      connection,
    });

    this._contents.set(user.id, user);

    return user;
  }

  #generateId() {

  }
}