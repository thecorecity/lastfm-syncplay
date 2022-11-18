import BaseMessage from "../../base/BaseMessage.mjs";

export default class RoomCreateMessage extends BaseMessage {
  get password() {
    return this._payload.password;
  }
}