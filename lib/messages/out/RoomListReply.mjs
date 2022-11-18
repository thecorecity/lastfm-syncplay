import BaseMessage from "../../base/BaseMessage.mjs";

export default class RoomListReply extends BaseMessage {
  /**
   * @param {Room[]} rooms
   */
  constructor({rooms}) {
    super({
      $t: 'roomList',
      rooms: rooms.map(room => ({
        id: room.id,
        owner: room.owner,
        locked: room.locked
      }))
    });
  }
}