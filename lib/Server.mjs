import fastify from "fastify";
import UsersCollection from "./collections/UsersCollection.mjs";
import RoomsCollection from "./collections/RoomsCollection.mjs";
import path from "path";

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
    this.#app.register(import('@fastify/static'), {
      root: path.join(process.cwd(), 'frontend', 'dist'),
    });

    this.#route();

    this.#app.listen({
      port: 9000
    });

    this.#app.setErrorHandler((error, request, reply) => {
      console.error(error);
      reply.send(error);
    })
  }

  #route() {
    this.#app.register(async fastify => {
      fastify.get('/ws', {websocket: true}, connection => {
        const user = this.users.create(connection);

        if (user && user.id) {
          connection.socket.send(JSON.stringify({
            status: true,
            message: 'Connected to server! User ID: ' + user.id,
          }))
        }
      });
    })
  }

  get users() {
    return this.#users
  }

  get rooms() {
    return this.#rooms
  }
}