import { ArgsOf, Discord, On } from "@typeit/discord";
import { Client } from "discord.js";
import { Config } from "../config";
import { IQuestion } from "../models/question";
import QAController from "../database/QAController";
import * as dotenv from "dotenv";

@Discord(Config.qa.command) // Decorate the class
// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class CommandMode {
  @On("message")
  private async onMessage(
    [message]: ArgsOf<"message">,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    client: Client,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    guardPayload: any
  ) {
    const env = dotenv.config();
    if (message.author.bot || message.channel.id != env.parsed.LEARN_CHANNEL)
      return;
    const l = message.content.replace(Config.qa.command, "");

    if (l.startsWith(Config.qa.commands.search)) {
      const questions: IQuestion[] = await QAController.searchSimilars(
        l.replace(Config.qa.commands.search, "")
      );
      questions.forEach(async (q) => {
        await message.channel.send(
          `_id:${q._id} / question:${q.question} / answer:${q.answer}`
        );
      });
    } else if (l.startsWith(Config.qa.commands.deleteId)) {
      await QAController.deleteById(l.replace(Config.qa.commands.deleteId, ""));
    }
  }
}
