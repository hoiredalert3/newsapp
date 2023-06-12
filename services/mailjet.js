"use strict";

const Mailjet = require("node-mailjet");

function sendForgotPasswordMail(user, otp) {
  const mailjet = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );

  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "20120548@student.hcmus.edu.vn",
          Name: "Báo mới Việt Nam",
        },
        To: [
          {
            Email: user.email,
            Name: user.name,
          },
        ],
        Subject: "[Báo mới] Quên mật khẩu",
        HTMLPart: `
                <p style="font-size: 20px; color: black;">Xin chào <b>${user.name}</b>,</p>
                <p style="font-size: 20px;  color: black;">Chúng tôi đã gửi một mã OTP đến ${user.email} của bạn.</p>
                <br/>
                <p style="font-size: 20px;  color: black;"><b>Mã xác nhận là:</b></p>
                <br/>
                <p style="font-size: 30px;  color: black;"><b>${otp}</b></p>
                <br/>
                <p style="font-size: 20px;  color: black;">Nếu bạn không yêu cầu cài đặt lại mật khẩu, xin vui lòng bỏ qua email này hoặc trả lời lại để chúng tôi biết!</p>
                <p style="font-size: 20px;  color: black; "> Mã xác nhận của bạn chỉ tồn tại trong vòng <b>5 phút</b>!</p>
                <br/>
                <p style="font-size: 20px;  color: black; ">Trân trọng,</p>
                <p style="font-size: 20px;  color: black; "><b>Báo mới Việt Nam</b></p>`,
      },
    ],
  });

  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });

  return request;
}

module.exports = { sendForgotPasswordMail };
