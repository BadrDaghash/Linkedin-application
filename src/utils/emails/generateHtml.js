// export const signUp = (otp) => `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Email Verification</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f9f9f9;
//       margin: 0;
//       padding: 0;
//       text-align: center;
//     }
//     .email-container {
//       max-width: 600px;
//       margin: 30px auto;
//       background-color: #ffffff;
//       border: 1px solid #dddddd;
//       border-radius: 8px;
//       overflow: hidden;
//       text-align: center;
//     }
//     .header {
//       background-color: #000000;
//       color: #ffffff;
//       padding: 20px;
//     }
//     .header h1 {
//       margin: 0;
//       font-size: 24px;
//     }
//     .content {
//       padding: 20px;
//     }
//     .content h2 {
//       color: #000000;
//       font-size: 20px;
//       margin-bottom: 10px;
//     }
//     .content p {
//       color: #333333;
//       line-height: 1.6;
//       margin: 10px 0;
//     }
//     .btn {
//       display: inline-block;
//       margin: 20px auto;
//       padding: 10px 20px;
//       background-color: #000000;
//       color: #ffffff;
//       text-decoration: none;
//       border-radius: 5px;
//       font-weight: bold;
//     }
//     .footer {
//       background-color: #f9f9f9;
//       text-align: center;
//       padding: 10px;
//       font-size: 12px;
//       color: #777777;
//     }
//   </style>
// </head>
// <body>
//   <div class="email-container">
//     <div class="header">
//       <h1>Welcome to Saraha!</h1>
//     </div>
//     <div class="content">
//       <h2>Hello,</h2>
//       <p>Thank you for signing up for Saraha. Please confirm your email address to get started.</p>
//       <p>Click the button below to verify your email:</p>
//       <a href="" ><h3 class="btn">${otp}</h3></a>
     
//     </div>
//     <div class="footer">
//       <p>&copy; 2025 Saraha. All rights reserved.</p>
//     </div>
//   </div>
// </body>
// </html>

// `;



export const signUp = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LinkedIn Email Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f3f2ef;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .header {
      background-color: #0a66c2;
      color: #ffffff;
      padding: 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content h2 {
      color: #333333;
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      color: #555555;
      line-height: 1.6;
      margin: 10px 0;
    }
    .btn {
      display: inline-block;
      margin: 20px auto;
      padding: 12px 25px;
      background-color: #0a66c2;
      color: #ffffff;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      font-size: 16px;
    }
    .footer {
      background-color: #f3f2ef;
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Welcome to LinkedIn!</h1>
    </div>
    <div class="content">
      <h2>Hello,</h2>
      <p>You're just one step away from joining the world's largest professional network.</p>
      <p>Use the OTP below to verify your email:</p>
      <h3 class="btn">${otp}</h3>
      <p>If you didn't sign up for LinkedIn, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 LinkedIn Corporation. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;



export const jobApplicationEmail = (firstName, decision) => {
  const message =
    decision === "accepted"
      ? `Congratulations! Your application has been accepted. We will contact you soon for further steps.`
      : `Thank you for applying. Unfortunately, we have decided to move forward with other candidates. We encourage you to apply for future opportunities.`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Job Application ${decision === "accepted" ? "Accepted" : "Rejected"}</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; text-align: center; }
      .email-container { max-width: 600px; margin: 30px auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
      .header { background-color: ${decision === "accepted" ? "#0077B5" : "#333333"}; color: #ffffff; padding: 20px; }
      .content { padding: 20px; color: #333333; }
      .footer { margin-top: 20px; font-size: 12px; color: #777777; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Job Application ${decision === "accepted" ? "Accepted" : "Rejected"}</h1>
      </div>
      <div class="content">
        <h2>Dear ${firstName},</h2>
        <p>${message}</p>
        <p>Best regards,</p>
        <p><strong>HR Team</strong></p>
      </div>
      <div class="footer">
        <p>&copy; 2025 Company Name. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
};  
