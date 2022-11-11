import LastFm_PlaylistTrack from "./PlaylistTrack.mjs";

export default class LastFm_Playlist {
  /** @type {LastFm_PlaylistTrack[]} */
  #list = [];
  #index = 0;

  constructor(list) {
    this.#list = list.map((track) => new LastFm_PlaylistTrack(track));
  }

  get size() {
    return this.#list.length;
  }

  reset() {
    this.#index = 0;
    return this.#list[this.#index];
  }

  next() {
    this.#index = Math.min(++this.#index, this.#list.length);
    return this.#list[this.#index] ?? null;
  }

  current() {
    return this.#list[this.#index] ?? null;
  }
}