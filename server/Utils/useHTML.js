
const sendEmailCode = (name, code) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@300&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #2e2e2e;
            font-family: 'Roboto', sans-serif;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .email-container {
            background-color: #1e1e1e;
            width: 90%;
            max-width: 500px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }
        .header {
            background-color: #161616;
            padding: 20px;
            text-align: center;
        }
        .header img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }
        .header h1 {
            display: inline-block;
            margin-left: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            color: #00cccc;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            font-family: 'Poppins', sans-serif;
            color: #00cccc;
            margin-bottom: 20px;
            font-size: 22px;
        }
        .content p {
            margin-bottom: 10px;
            color: #b3b3b3;
            line-height: 1.5;
        }
        .otp {
            background-color: #333333;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            color: #00cccc;
            letter-spacing: 2px;
        }
        .footer {
            padding: 20px;
            background-color: #161616;
            text-align: center;
            font-size: 14px;
            color: #7a7a7a;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://i.ibb.co/dGRdStQ/Martin-Berube-Flat-Animal-Parrot-256.png" alt="TalkAtive Logo">
            <h1>TalkAtive</h1>
        </div>
        <div class="content">
            <h2>Password Reset Code</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>You requested to reset your password. Please use the following code to proceed with the password reset process:</p>
            <div class="otp">${code}</div>
            <p>This code is valid for the next 10 minutes. If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Thank you,</p>
            <p>Team TalkAtive</p>
        </div>
    </div>
</body>
</html>
`;
};

const PassResetConfirmation = (name) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Code</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@300&display=swap" rel="stylesheet">
    <style>
        body {
            background-color: #2e2e2e;
            font-family: 'Roboto', sans-serif;
            color: #ffffff;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .email-container {
            background-color: #1e1e1e;
            width: 90%;
            max-width: 500px;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        }
        .header {
            background-color: #161616;
            padding: 20px;
            text-align: center;
        }
        .header img {
            width: 50px;
            height: 50px;
            vertical-align: middle;
        }
        .header h1 {
            display: inline-block;
            margin-left: 10px;
            font-family: 'Poppins', sans-serif;
            font-size: 24px;
            color: #00cccc;
        }
        .content {
            padding: 30px 20px;
            text-align: center;
        }
        .content h2 {
            font-family: 'Poppins', sans-serif;
            color: #00cccc;
            margin-bottom: 20px;
            font-size: 22px;
        }
        .content p {
            margin-bottom: 10px;
            color: #b3b3b3;
            line-height: 1.5;
        }
        .otp {
            background-color: #333333;
            padding: 10px 20px;
            border-radius: 5px;
            display: inline-block;
            margin: 20px 0;
            font-family: 'Poppins', sans-serif;
            font-size: 28px;
            color: #00cccc;
            letter-spacing: 2px;
        }
        .footer {
            padding: 20px;
            background-color: #161616;
            text-align: center;
            font-size: 14px;
            color: #7a7a7a;
        }
        .footer p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://i.ibb.co/dGRdStQ/Martin-Berube-Flat-Animal-Parrot-256.png" alt="TalkAtive Logo">
            <h1>TalkAtive</h1>
        </div>
        <div class="content">
            <h2>Password Changed Successfully!!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Your password has been successfully changed. You can now log in with your new password.</p>
            <p>If you didn't make this change, please contact our support team immediately.</p>
        </div>
        <div class="footer">
            <p>Thank you,</p>
            <p>Team TalkAtive</p>
        </div>
    </div>
</body>
</html>`
}

module.exports = {
    sendEmailCode,
    PassResetConfirmation
};
