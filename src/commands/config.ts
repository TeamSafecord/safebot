import {CommandInteraction, Role} from "discord.js";
import SlashCommand from "../SlashCommand";

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

  public async exec(i: CommandInteraction) {
    switch (i.options.getSubcommand()) {
      case "verify_role": {
        const role = i.options.getRole("role", true);

        if (!(role instanceof Role)) {
          return i.reply(
              "Required scope `bot` is missing., Re-add me with the scope and try again",
          );
        }

        const botRoles = i.guild.me.roles;
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

        if (role.permissions.toArray().some((p) => disallowedPermissions.includes(p))) {
          return i.reply(
              `The role being applied must not have any of the following permissions. Remove them and try again.\n${
              role.permissions.has("ADMINISTRATOR") ?
                 "`ADMINISTRATOR`" :
                 role.permissions
                     .toArray()
                     .filter((p) => disallowedPermissions.includes(p))
                     .map((p) => `\`${p}\``)
                     .join("\n")
              }`,
          );
        }

        if (role.rawPosition > botRoles.highest.rawPosition) {
          return i.reply({
            content: `I cannot assign that role! Move or Create a new role under ${botRoles.highest.toString()}`,
            allowedMentions: {parse: []},
          });
        }

        // assign role to guild
        // await Guild.findOneAndUpdate({ _id: i.guild.id }, { verificationRole: role.id }, { upsert: true });

        return i.reply({
          content: `Verification role set to ${role.toString()}`,
          allowedMentions: {parse: []},
        });
      }
    }
  }
}
