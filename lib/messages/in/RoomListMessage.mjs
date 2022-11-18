import BaseMessage from "../../base/BaseMessage.mjs";

export default class RoomListMessage extends BaseMessage {
  get rooms() {
    return this._payload.rooms;
  }
}