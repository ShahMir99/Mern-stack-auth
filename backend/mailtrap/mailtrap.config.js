import { MailtrapClient } from "mailtrap";
import { Config } from "../config/index.js";

export const mailTrapClient = new MailtrapClient({
  token: Config.mailTrap.token,
});

export const mailTrapSender = {
  email: "mailtrap@demomailtrap.com",
  name: "Shahmir",
};
