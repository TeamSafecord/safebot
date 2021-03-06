import axios from "axios";
import { CommandInteraction } from "discord.js";
import SlashCommand from "../SlashCommand";

export default class ManualVerification extends SlashCommand {
  constructor() {
    super("manual-verify", "Manually verify a user.", [
      {
        name: "user",
        description: "The user to verify",
        type: "USER",
        required: true,
      },
    ]);
  }

  public async exec(i: CommandInteraction) {
    if (!i.inCachedGuild()) return i.reply({ content: "You need to use this command in a server!", ephemeral: true });
    
    await i.deferReply();

    const member = i.options.getMember("user", true);

    const guildDoc = await axios.get<{ guild: {verificationRole: string} }>(`http://api.safecord.xyz/mongo/guilds/${i.guild.id}`, { 
      headers: { "authorization": process.env.BACKEND_API_KEY ?? "89aLG9EEsWKgTzZio1ZW" },
    });

    if (!guildDoc) {
      return i.editReply({
        content:
        "Looks like this server doesn't have a verification role setup! Please run `/setup` before running this.",
      });
    }

    const role = i.guild.roles.cache.get(guildDoc.data.guild.verificationRole);

    if (!role) {
      return i.editReply({
        content: "Looks like you deleted the role..(Re-run /setup!)",
      });
    }

    if (!member.roles.cache.has(role.id)) return i.followUp("This user is already verified!");

    await member.roles.add(role);

    return i.followUp({content: `Alright... Manually verified ${member.user.tag}`});
  }
}
