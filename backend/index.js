const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const mongoose = require("mongoose")
const app = express();
const PORT = 8080;
app.use(express.json());
app.use(cors());


mongoose
  .connect("mongodb+srv://ksharishcs:Hrxz%402004@cluster0.dzr7anj.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("db connected succesfully");
  })
  .catch(() => {
    console.log("db not connected succesfully");
  });

const details = mongoose.model("details", {}, "bulkmail");


app.post("/sendmail", (req, res) => {
  var message = req.body.data;
  var emails = req.body.list;
  console.log(message);



  details.find().then((data) => {
    console.log(data)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: data[1].toJSON().user,
        pass: data[1].toJSON().password,
      },
    });

    new Promise(async (resolve, reject) => {
      try {
        for (i = 0; i < emails.length; i++) {
          await transporter.sendMail({
            from: "ksharishcs20@gmail.com",
            to: emails[i],
            subject: "Hello from Node.js!",
            text: message,
          });
          console.log("emailsendto:" + emails[i]);
        }

        resolve("success");
      } catch (err) {
        reject("fail");
      }
    })
      .then(() => {
        res.send(true);
      })
      .catch(() => {
        res.send(false);
      });


  }).catch(() => {
      console.log("connected but error in gettin details");
    });




});
app.listen(PORT, () => {
  console.log("server started");
});
