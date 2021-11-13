import { ApplicationCommandOptionData, Client, CommandInteraction } from "discord.js";
import CommandHandler from "./CommandHandler";

export default class SlashCommand {
    constructor(public name: string, public description: string, public opts?: ApplicationCommandOptionData[]) {}

    public client: Client;
    public handler: CommandHandler;

    public exec(i: CommandInteraction) {

    }
}