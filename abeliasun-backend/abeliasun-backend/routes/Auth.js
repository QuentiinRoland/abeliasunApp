const express = require("express");
const { getAuth } = require("firebase-admin/auth");

const router = express.Router();

router.get("/users", async (req, res) => {
  try {
    const listUsers = async (nextPageToken) => {
      const result = [];
      const listUsersResult = await getAuth().listUsers(1000, nextPageToken);
      result.push(...listUsersResult.users);
      if (listUsersResult.pageToken) {
        const moreUsers = await listUsers(listUsersResult.pageToken);
        result.push(...moreUsers);
      }
      return result;
    };

    const users = await listUsers();
    res.json(users);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des utilisateurs Firebase :",
      error
    );
    res
      .status(500)
      .json({ error: "Impossible de récupérer les utilisateurs Firebase." });
  }
});

router.delete("/delete/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    await getAuth().deleteUser(uid);
    res.json({ message: `Utilisateur avec UID ${uid} supprimé.` });
  } catch (error) {
    console.error(
      "Erreur lors de la suppression de l'utilisateur Firebase :",
      error
    );
    res
      .status(500)
      .json({ error: "Impossible de supprimer l'utilisateur Firebase." });
  }
});

module.exports = router;
