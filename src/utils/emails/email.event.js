import { EventEmitter } from "events";
import jwt from "jsonwebtoken";

import { signUp } from "./generateHtml.js";
import sendEmails, { subjects } from "./sendEmails.js";

export const emailEmitter = new EventEmitter();

emailEmitter.on("sendEmail", async(email ,otp , subject) => {

  await sendEmails({
    to: email,
    subject,
    html: signUp(otp),
  });

});

emailEmitter.on("jobApplicationEmail", async (email, firstName, decision) => {
  await sendEmails({
    to: email,
    subject: subjects[decision], 
    html: jobApplicationEmail(firstName, decision),
  });
});

