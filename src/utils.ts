// We extend null so it removes some unnecessary things from the class like protyping. This class should only have static methods.

import { CommandInteraction } from "discord.js";

export default class Utils extends null {
  public static async getMember(i: CommandInteraction) {
    if (!i.inGuild()) return i.reply({ content: "This command has to be run in the guild!", ephemeral: true });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const member = await i.guild.members.fetch(i.user.id).catch(() => {});

    if (!member)
      return i.reply({
        content: "Couldn't fetch this member.. Was I invited properly? Contact `/support`!",
        ephemeral: true,
      });

    return member;
  }
}
