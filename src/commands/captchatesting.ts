import {CommandInteraction, MessageAttachment} from "discord.js";
import SlashCommand from "../SlashCommand";
import fetch from "node-fetch";

interface ICaptchaResponse {
    statusCode: 200 | 500
    data: {
        captchaBuffer: { type: string, data: Array<Buffer> }
        captchaText: string
    }
}

async function getCaptcha(diff: number) {
  try {
    const res = await fetch("https://api.safecord.xyz/gen/captcha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        difficulty: diff,
      }),
    });

    const json = await res.json() as ICaptchaResponse;

    const attachment = new MessageAttachment(
        Buffer.from(json.data.captchaText, "utf-8"),
        "captcha.png"
    );
    return attachment;
  } catch (error) {
    console.log(error);
  }
}

export default class CaptchaTest extends SlashCommand {
  constructor() {
    super("captchatest", "Sends a test captcha!");
  }

  public async exec(i: CommandInteraction) {
    const image = await getCaptcha(5);
    this.embed.setImage("attachment://captcha.png");
    this.embed.setTitle("Captcha Test");
    i.reply({files: [image], embeds: [this.embed]});
  }
}
