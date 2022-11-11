import fastify from "fastify";
import UsersCollection from "./collections/UsersCollection.mjs";
import RoomsCollection from "./collections/RoomsCollection.mjs";

export default class Server {
  /** @type {FastifyInstance} */
  #app;

  /** @type {UsersCollection} */
  #users;

  /** @type {RoomsCollection} */
  #rooms;

  initialize() {
    this.#users = new UsersCollection(this);
    this.#rooms = new RoomsCollection(this);

    this.#bootstrap();
  }

  #bootstrap() {
    this.#app = fastify();

    this.#app.register(import('@fastify/websocket'));

    this.#route();

    this.#app.listen(228);
  }

  #route() {
    this.#app.get('/ws', {websocket: true}, connection => {

    });
  }

  get users() {
    return this.#users
  }

  get rooms() {
    return this.#rooms
  }
}