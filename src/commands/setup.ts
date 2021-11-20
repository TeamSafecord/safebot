import { CommandInteraction, MessageActionRow, MessageButton } from "discord.js";
import SlashCommand from "../SlashCommand";
import Utils from "../utils";

export default class SetupCommand extends SlashCommand {
  constructor() {
    super("setup", "Quickly setup your server!");
  }

  public async exec(i: CommandInteraction) {
    const member = await Utils.getMember(i);

    if (!member) return; // silent return because the utils function handles it

    if (!member.permissions.has("MANAGE_GUILD")) {
      return i.reply({ content: "You need the permission `Manage Server` to use this command!", ephemeral: true });
    }

    await i.deferReply({ ephemeral: true });

    // TODO: Check if the user has setup a custom description from the backend

    const button = new MessageButton()
      .setStyle("LINK")
      .setURL(`https://safecord.xyz/verify/${i.guild.id}`)
      .setLabel("Verify");

    const row = new MessageActionRow().addComponents(button);

    await i.channel.send({
      embeds: [this.embed.setDescription("Welcome to the server! Verify by clicking the button below!")],
      components: [row],
    });

    // TODO: Store the message in the database through a post request to the backend for later editing.

    return i.editReply(
      `Sucessfully setup! Make sure to checkout [this](https://safecord.xyz/servers/${i.guild.id}) link for customizing this message!`
    );
  }
}
