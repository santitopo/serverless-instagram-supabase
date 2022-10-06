const functions = require("firebase-functions");
const cors = require("cors")({ origin: true });

const admin = require("firebase-admin");
const db = admin.app().firestore();

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(404).send();
    }

    if (!req.headers.authorization) {
      return res.json({ result: "Header Authorization not provided" });
    }

    db.collection("emails")
      .add({
        to: "santiagotopolansky@gmail.com",
        message: {
          subject: "Esto es una prueba!",
          html: `
            <h4>Invitacion de registro a la plataforma</h4>
            <p>Esta es una invitacion a unirse a la organizacion No Mas Colillas</p> <br>
            <p>Haz click en este <a href=${process.env.BASE_URL}/register?email=${req.body.to}>link</a> 
            para completar el registro</p>`,
        },
      })
      .then(() => {
        res.status(200).json({
          result: `Invitation link sent to ${req.body.to}`,
        });
      })
      .catch((error) => {
        console.log(error);
        res
          .status(400)
          .json({ result: `Failed to send invitation to ${req.body.to}` });
      });
  });
});

exports.finishAdminRegistration = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method !== "POST") {
      return res.status(404).send();
    }

    let decoded;
    try {
      decoded = jsonwebtoken.verify(req.body.token, process.env.JWT);
    } catch (error) {
      console.log(error);
      return res.status(400).json({ result: `Invalid token ${error.message}` });
    }

    admin
      .auth()
      .createUser({
        email: req.body.email,
        password: req.body.password,
        emailVerified: true,
        displayName: req.body.name,
        disabled: false,
      })
      .then((userRecord) => {
        res.status(200).json({
          result: `Successfully registered new user ${decoded.email}`,
        });
      })
      .catch((error) => {
        console.log("Error creating new user:", error);
      });
  });
});
