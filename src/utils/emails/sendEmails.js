import nodemailer from "nodemailer";
const sendEmails = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from:  `"Linkedin Application" <${process.env.APP_EMAIL}>`,
    to,
    subject,
    html,
  });
  console.log(info);

  return info.rejected.length == 0 ? true : false;
};


export const subjects ={ 
  register :"Activate account",
  forgetPassword :"Forget Password",
  resetPassword :"Reset Password",
  accepted:"Job Application Accepted",
  rejected:"Job Application Rejected",
}

export default sendEmails; 