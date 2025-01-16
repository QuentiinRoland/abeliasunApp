const sequelize = require("./config/database");
const Service = require("./models/Service");
const SubService = require("./models/SubService");
const prestations = require("./models/Prestations");

const seedDatabase = async () => {
  try {
    // Synchronisation des modèles avec la base
    await sequelize.sync; // ATTENTION : Efface toutes les données existantes

    // Parcourir les prestations et insérer les données
    for (const prestation of prestations) {
      const service = await Service.create({ name: prestation.name });

      for (const subservice of prestation.subservices) {
        await SubService.create({
          name: subservice.name,
          serviceId: service.id,
        });
      }
    }
    console.log("Prestations à insérer:", prestations);

    console.log("Données insérées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'initialisation des données :", error);
  } finally {
    await sequelize.close(); // Fermer la connexion à la base
  }
};

seedDatabase();
