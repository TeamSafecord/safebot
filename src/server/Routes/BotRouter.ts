import {FastifyInstance} from "fastify";

interface addRoleBody {
  guild_id: string;
  role_id: string;
  user_id: string;
}

interface guildBody {
  guild_id: string;
}

interface IResponseGuild {
  guild_id: string;
  name: string;
  avatar_url: string;
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
        if (request.headers["authorization"] !== process.env.BOT_API_KEY ?? 'qrtdrspZWv') {
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

  fastify.post<{Body: guildBody}>("/guild", async (request, res) => {
    if (!request.body.guild_id) return res.status(401).send({error: "missing guild id!"});
    const guild = await fastify.client.guilds.fetch(request.body.guild_id);

    if (!guild) return res.status(404).send({error: "Could not find guild!"});

    const guildObj: IResponseGuild = {
      avatar_url: guild.iconURL({dynamic: true, format: "png"}),
      guild_id: guild.id,
      name: guild.name,
    };

    return res.status(200).send({guild: guildObj});
  });
};

export const autoPrefix = "/bot";
