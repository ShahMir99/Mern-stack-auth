import { PASSWORD_RESET_REQUEST_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplate.js";
import { mailTrapClient, mailTrapSender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationCode) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: mailTrapSender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationCode
      ),
      category: "Email Verification",
    });

    console.log("Email send successfully", response);
  } catch (error) {
    console.log("Error sending verification Email", error);
    throw new Error(`Error sending verification email ${error}`);
  }
};

export const sendWelcomEmail = async (name, email) => {
  const recipient = [{email}]
  try {
    const response = await mailTrapClient.send({
      from: mailTrapSender,
      to: recipient,
      template_uuid: "c8eac6a0-925d-4859-9db6-6361cb6318c6",
      template_variables: {
        company_info_name: "Shahmir's Company",
        name: name,
      },
    });

    console.log("Weclome Email send successfully", response);

  } catch (error) {
    console.log("Error sending welcome Email", error);
    throw new Error(`Error sending welcome Email ${error}`);
  }
};


export const sendPasswordResetEmail = async (email, url) => {
  const recipient = [{email}]
  try {
    const response = await mailTrapClient.send({
      from: mailTrapSender,
      to: recipient,
      subject : "Reset password request",
      html : PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",url),
      category : "reset password request"
    });

    console.log("Send reset password request successfully", response);

  } catch (error) {
    console.log("Error sending reset password request", error);
    throw new Error(`Error sending welcome request ${error}`);
  }
};
