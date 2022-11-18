import RoomCreateMessage from "./in/RoomCreateMessage.mjs";
import RoomListMessage from "./in/RoomListMessage.mjs";

export default class MessageParser {
  static parse(content) {
    const payload = JSON.parse(content);
    const messageType = payload.$t;

    if (this.#messageTypes.hasOwnProperty(messageType)) {
      return new this.#messageTypes[messageType](payload);
    }

    return null;
  }

  static #messageTypes = {
    createRoom: RoomCreateMessage,
    listRooms: RoomListMessage,
  }
}