import { CommandInteraction, MessageAttachment } from 'discord.js'
import SlashCommand from '../SlashCommand'
import fetch from 'node-fetch'

interface captchaResponse {
    data: {
        captcha: string
        captchaImg: any // TODO: Fix this nick
    }
}

async function getCaptcha(diff: number) {
    try {
        const res = await fetch(`https://api.safecord.xyz/gen/captcha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                difficulty: diff,
            }),
        })

        const json: any = await res.json() // user interface captchaResponse (i cant get it to work)

        const attachment = new MessageAttachment(
            Buffer.from(json.data.captchaImg, 'utf-8'),
            'captcha.png'
        )
        return attachment
    } catch (error) {
        console.log(error)
    }
}

export default class PingCommand extends SlashCommand {
    constructor() {
        super('captchatest', 'Sends a test captcha!')
    }

    public async exec(i: CommandInteraction) {
        this.embed.setImage('attachment://captcha.png')
        this.embed.setTitle('Captcha Test')
        i.reply({ files: [await getCaptcha(5)], embeds: [this.embed] })
    }
}
