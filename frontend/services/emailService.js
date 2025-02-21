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

    // Récupérer les emails additionnels via une requête API
    let additionalEmails = [];
    try {
      const response = await fetch(
        `https://abeliasun-backend-5c08804f47f8.herokuapp.com/api/customers/${invoice.customerId}`
      );
      const customerData = await response.json();
      if (customerData.additionalEmail) {
        additionalEmails = Array.isArray(customerData.additionalEmail)
          ? customerData.additionalEmail
          : [customerData.additionalEmail];
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des emails additionnels:",
        error
      );
    }

    // Préparer la liste des destinataires
    const recipients = [
      invoice.customer?.email,
      ...additionalEmails,
      invoice.company?.email,
    ].filter((email) => email && typeof email === "string");

    console.log("Liste finale des destinataires:", recipients);

    formData.append("recipients", JSON.stringify(recipients));
    formData.append("subject", `Facture N°${invoice.numberInvoice}`);

    // Créer le contenu du message
    const messageContent = `
      Bonjour,
      
      Veuillez trouver ci-joint votre facture N°${invoice.numberInvoice}.
      
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
      throw new Error("Erreur lors de l'envoi de l'email");
    }

    return true;
  } catch (error) {
    console.error("Erreur envoi email:", error);
    throw error;
  }
};
