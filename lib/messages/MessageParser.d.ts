import RoomCreateMessage from './in/RoomCreateMessage.mjs';
import RoomListMessage from './in/RoomListMessage.mjs';

export interface BackendMessageTypes {
    createRoom: RoomCreateMessage;
    listRooms: RoomListMessage;
}