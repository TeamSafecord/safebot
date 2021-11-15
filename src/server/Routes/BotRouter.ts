import {FastifyInstance} from "fastify";

interface addRoleBody {
  guild_id: string;
  role_id: string;
  user_id: string;
}

export default async (fastify: FastifyInstance) => {
  fastify.post<{Body: addRoleBody}>(
      "/addRole",
      {
        schema: {
          body: {
            type: "object",
            properties: {
              guild_id: {
                type: "string",
              },
              role_id: {
                type: "string",
              },
              user_id: {
                type: "string",
              },
            },
            required: ["guild_id", "role_id", "user_id"],
          },
        },
      },
      async (request, reply) => {
        if (request.headers["authorization"] !== process.env.API_KEY ?? 'qrtdrspZWv') {
          return reply.code(401).send({statusCode: 401, message: "Unauthorized"});
        }

        // eslint-disable-next-line camelcase -- I wanna be like discord
        const {guild_id, role_id, user_id} = request.body;

        // Fetching incase bot is sharded
        const guild = await fastify.client.guilds.fetch(guild_id).catch(() => null);

        if (!guild) {
          return reply.code(400).send({statusCode: 400, message: "Guild not found"});
        }

        const role = await guild.roles.fetch(role_id).catch(() => null);

        if (!role) {
          return reply.code(400).send({statusCode: 400, message: "Role not found"});
        }

        const member = await guild.members.fetch(user_id).catch(() => null);

        if (!member) {
          return reply.code(400).send({statusCode: 400, message: "Member not found"});
        }

        await member.roles
            .add(role)
            .then((member) => {
              reply.send({statusCode: 200, member});
            })
            .catch((error) => {
              reply.code(500).send({statusCode: 500, message: error.message});
            });
      },
  );
};

export const autoPrefix = "/bot";
