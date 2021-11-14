import {ApplicationCommandOptionData, Client, CommandInteraction, MessageEmbed} from "discord.js";
import CommandHandler from "./CommandHandler";

export default class SlashCommand {
  constructor(
    public name: string,
    public description: string,
    public opts?: ApplicationCommandOptionData[],
  ) {}

  public client: Client;
  public handler: CommandHandler;
  public embed = new MessageEmbed()
      .setColor("#23272A")
      .setTimestamp()
      .setFooter("Safecord", "https://cdn.discordapp.com/icons/908908168682299413/9557cf6b14e724869efd0ad7f74af811.webp?size=96"); // TODO: Update icon

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public exec(i: CommandInteraction) {}
}
