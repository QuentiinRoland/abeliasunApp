const admin = require("firebase-admin");
const serviceAccount = require("./abeliasun-firebase-adminsdk-2mpxl-48e16b1656.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://abeliasun.firebaseio.com",
});

module.exports = admin;
