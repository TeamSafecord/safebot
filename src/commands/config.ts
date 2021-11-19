import { CommandInteraction, Role, MessageActionRow, MessageButton, Message } from "discord.js";
import SlashCommand from "../SlashCommand";
import axios from "axios";

export default class SetupCommand extends SlashCommand {
  constructor() {
    super("config", "Update your server config!", [
      {
        type: "SUB_COMMAND",
        name: "verify_role",
        description: "Change the role given after user completes verification",
        options: [
          {
            type: "ROLE",
            name: "role",
            description: "Role to apply when verifying",
            required: true,
          },
        ],
      },
    ]);
  }

  public async exec(int: CommandInteraction) {
    switch (int.options.getSubcommand()) {
      case "verify_role": {
        const role = int.options.getRole("role", true);

        if (!(role instanceof Role)) {
          return int.reply("Required scope `bot` is missing., Re-add me with the scope and try again");
        }

        const botRoles = int.guild.me.roles;
        const disallowedPermissions = [
          "ADMINISTRATOR",
          "KICK_MEMBERS",
          "BAN_MEMBERS",
          "MANAGE_CHANNELS",
          "MANAGE_GUILD",
          "MANAGE_MESSAGES",
          "MENTION_EVERYONE",
          "MANAGE_ROLES",
        ];

        if (role.rawPosition > botRoles.highest.rawPosition) {
          return int.reply({
            content: `I cannot assign that role! Move or Create a new role under ${botRoles.highest.toString()}`,
            allowedMentions: { parse: [] },
          });
        }

        if (role.permissions.toArray().some((p) => disallowedPermissions.includes(p))) {
          if (role.permissions.has("ADMINISTRATOR")) {
            return int.reply(
              "The role being applied must not have the `ADMINISTRATOR` permission. Remove it and try again."
            );
          }

          const reply = (await int.reply({
            content: `The role being applied has some dangerous permissions.\n${role.permissions
              .toArray()
              .filter((p) => disallowedPermissions.includes(p))
              .map((p) => `\`${p}\``)
              .join("\n")}\nAre you sure you want to use this role?`,
            components: [
              new MessageActionRow().addComponents([
                new MessageButton().setStyle("SUCCESS").setLabel("Yes").setCustomId("yes"),
                new MessageButton().setStyle("DANGER").setLabel("No").setCustomId("no"),
              ]),
            ],
            fetchReply: true,
          })) as Message;

          const collector = reply.createMessageComponentCollector({
            filter: (i) => i.message.id === reply.id && i.user.id === int.user.id,
            componentType: "BUTTON",
            time: 10000,
          });

          collector.on("collect", async (i) => {
            switch (i.customId) {
              case "yes": {
                const req = (
                  await axios.patch(
                    `https://api.safecord.xyz/mongo/guild/${int.guild.id}`,
                    {
                      verificationRole: role.id,
                    },
                    {
                      headers: {
                        "Content-Type": "application/json",
                        authorization: process.env.BACKEND_API_KEY ?? "89aLG9EEsWKgTzZio1ZW",
                      },
                    }
                  )
                ).data;

                if (req.success) {
                  i.update({
                    content: `Verification role set to ${role.toString()}`,
                    allowedMentions: { parse: [] },
                    components: [],
                  });
                } else {
                  i.update({
                    content: "An error occurred while setting the verification role.",
                    components: [],
                  });
                }
                break;
              }
              case "no": {
                i.update({
                  content: "Please re-run the command with another role.",
                  components: [],
                });
              }
            }
          });

          collector.on("end", (collected) => {
            if (collected.size === 0) {
              reply.edit({
                content: "Timed out.",
                components: [],
              });
            }
          });

          return;
        }

        const req = (
          await axios.patch(
            `https://api.safecord.xyz/mongo/guild/${int.guild.id}`,
            {
              verificationRole: role.id,
            },
            {
              headers: {
                "Content-Type": "application/json",
                authorization: process.env.BACKEND_API_KEY ?? "89aLG9EEsWKgTzZio1ZW",
              },
            }
          )
        ).data;

        if (req.success) {
          return int.reply({
            content: `Verification role set to ${role.toString()}`,
            allowedMentions: { parse: [] },
          });
        } else {
          return int.reply(req.error);
        }
      }
    }
  }
}
