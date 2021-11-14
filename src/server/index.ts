import fastify from "fastify";
import fastifyAutoload from "fastify-autoload";
import path from "path";

export async function setupServer(port: number): Promise<void> {
  const server = fastify();

  server.register(fastifyAutoload, {
    dir: path.join(__dirname, "Routes"),
  });

  server.listen(port ?? 1337, "127.0.0.1", (err, address) => {
    if (err) {
      throw err;
    }

    console.log("Server running on " + address);
  });
}
