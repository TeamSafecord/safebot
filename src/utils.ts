// We extend null so it removes some needed thing from the object like prototypes

import {CommandInteraction} from "discord.js";

export default class Utils extends null {
  public static async getMember(i: CommandInteraction) {
    if (!i.inGuild()) return i.reply({ content: "This command has to be run in the guild!", ephemeral: true });

    const member = await i.guild.members.fetch(i.user.id).catch(() => {});

    if (!member) return i.reply({ content: "Couldn't fetch this member.. Was I invited properly? Contact `/support`!", ephemeral: true });

    return member;
  }
}
