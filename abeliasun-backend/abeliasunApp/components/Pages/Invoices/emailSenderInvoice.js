export const sendInvoiceEmail = async (invoice, pdfUri) => {
  try {
    console.log("Données de facture reçues:", invoice);

    // Créer un FormData pour envoyer le PDF
    const formData = new FormData();
    formData.append("pdf", {
      uri: pdfUri,
      type: "application/pdf",
      name: `facture_${invoice.numberInvoice}.pdf`,
    });

    // Récupérer les emails additionnels depuis l'API
    let additionalEmails = [];
    try {
      const response = await fetch(
        `https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/customers/${invoice.customerId}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du client");
      }
      const customerData = await response.json();
      additionalEmails = customerData.additionalEmail || [];
      console.log("Emails additionnels récupérés:", additionalEmails);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emails additionnels:",
        error
      );
    }

    // S'assurer que additionalEmails est bien un tableau
    if (!Array.isArray(additionalEmails)) {
      additionalEmails = additionalEmails ? [additionalEmails] : [];
    }

    // Préparer la liste des destinataires
    const recipients = [
      invoice.customer?.email,
      ...additionalEmails,
      invoice.company?.email,
    ].filter(
      (email) => email && typeof email === "string" && email.includes("@")
    );

    console.log("Liste finale des destinataires:", recipients);

    if (recipients.length === 0) {
      throw new Error("Aucun destinataire valide trouvé");
    }

    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", `Prestation N°${invoice.numberInvoice}`);

    // Créer le contenu du message
    const messageContent = `
      Coucou Titof, comment vas-tu mon père
      
      Veuillez trouver ci-joint votre prestation N°${invoice.numberInvoice}.
      
      Date d'émission : ${new Date(invoice.date).toLocaleDateString("fr-FR")}
      ${invoice.totalAmount ? `Montant total : ${invoice.totalAmount}€` : ""}
      
      Cordialement,
      ${invoice.company?.name || ""}
    `.trim();

    formData.append("message", messageContent);

    // Envoyer la requête
    const response = await fetch(
      "https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/send-invoice-email",
      {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'envoi de l'email");
    }

    return true;
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }
};
