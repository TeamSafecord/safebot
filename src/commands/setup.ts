import axios from "axios";
import { CommandInteraction, MessageActionRow, MessageButton, Role } from "discord.js";
import SlashCommand from "../SlashCommand";
import Utils from "../utils";

export default class SetupCommand extends SlashCommand {
  constructor() {
    super("setup", "Quickly setup your server!", [
      {
        name: "role",
        description: "Role to use for verification",
        type: "ROLE",
        required: true,
      },
    ]);
  }

  public async exec(i: CommandInteraction) {
    const member = await Utils.getMember(i);

    if (!member) return; // silent return because the utils function handles it

    const role = i.options.getRole("role", true) as Role;


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

    const msg = await i.channel.send({
      embeds: [this.embed.setDescription("Welcome to the server! Verify by clicking the button below!")],
      components: [row],
    });

    const res = await axios.patch(`https://api.safecord.xyz/mongo/guilds/${i.guild.id}`, { verificationMessageId: msg.id, 
      verificationEmbed: {
        title: this.embed.title, 
        description: this.embed.description, 
        footer: this.embed.footer, 
        color: this.embed.hexColor,
      },
      verificationRole: role.id,
    }, {
      headers: {
        "Content-Type": "application/json",
        "authorization": process.env.BACKEND_API_KEY ?? "89aLG9EEsWKgTzZio1ZW",
      },
    }).catch(() => console.warn("fuck eslint"));

    if (!res) {
      return i.editReply(`Hmmm.. Something went wrong. Please report this in the [support](https://discord.gg/r5jF68pdHd) server.`);
    }

    return i.editReply(
      `Sucessfully setup! Members will now recieve the ${role} role when they verify by clicking the link below! Make sure to checkout [this](https://safecord.xyz/servers/${i.guild.id}) link for customizing this message!`
    );
  }
}
