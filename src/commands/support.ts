import { CommandInteraction } from "discord.js";
import SlashCommand from "../SlashCommand";

export default class SupportCommand extends SlashCommand {
  constructor() {
    super("support", "Sends you an invite to the support server!");
  }

  public exec(i: CommandInteraction) {
    return i.reply({ content: 'https://discord.gg/r5jF68pdHd', ephemeral: true });
  }
}
