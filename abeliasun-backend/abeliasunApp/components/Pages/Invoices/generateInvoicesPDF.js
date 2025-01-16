import * as Print from "expo-print";
import { shareAsync } from "expo-sharing";

export const generateInvoicePDF = async (invoice) => {
  // Définir une couleur principale personnalisable
  const primaryColor = invoice.company?.primaryColor || "#2563eb";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          
          :root {
            --primary-color: ${primaryColor};
            --primary-light: ${primaryColor}15;
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Inter', Arial, sans-serif;
            padding: 25px;
            color: #1f2937;
            line-height: 1.4;
            background-color: white;
            max-width: 21cm;
            margin: 0 auto;
            position: relative;
          }
          @page {
            margin: 0;
            size: A4;
          }
          
          /* Background accent */
          body::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 8px;
            background: linear-gradient(to right, var(--primary-color), var(--primary-color)aa);
            border-radius: 0 0 4px 4px;
          }
          
          /* Header Styles */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid #e5e7eb;
          }
          
          .company-logo {
            max-width: 180px;
            height: auto;
          }
          
          .company-info {
            text-align: right;
            font-size: 0.875rem;
          }
          
          .company-info h3 {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-bottom: 8px;
          }
          
          .company-info p {
            margin: 4px 0;
            color: #4b5563;
          }
          
          /* Invoice Title */
          .invoice-title {
            text-align: center;
            font-size: 1.5rem;
            color: var(--primary-color);
            margin: 15px 0;
            font-weight: 700;
            letter-spacing: -0.025em;
          }
          
          .invoice-number {
            color: #6b7280;
            font-size: 1.1rem;
            font-weight: 400;
          }
          
          /* Grid Layout */
          .customer-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 40px;
          }
          
          .info-box {
            background: #f9fafb;
            padding: 20px;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            position: relative;
            overflow: hidden;
          }
          
          .info-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--primary-color);
            opacity: 0.8;
          }
          
          .info-box h3 {
            color: var(--primary-color);
            margin-bottom: 15px;
            font-size: 1.1rem;
            font-weight: 600;
          }
          
          .info-box p {
            margin: 8px 0;
            color: #4b5563;
          }
          
          .info-box strong {
            color: #1f2937;
            font-weight: 600;
          }
          
          /* Services Section */
          .services-section {
            margin: 40px 0;
          }
          
          .services-section h2 {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .service-item {
            background: white;
            padding: 15px;
            margin: 8px 0;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            transition: all 0.2s ease;
            position: relative;
          }
          
          .service-item::after {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            border-radius: 10px;
            background: linear-gradient(to bottom right, var(--primary-color)11, transparent);
            z-index: -1;
          }
          
          .service-item h3 {
            color: #1f2937;
            margin-bottom: 10px;
            font-size: 1.1rem;
          }
          
          .service-description {
            color: #6b7280;
            font-size: 0.925rem;
            margin-bottom: 15px;
          }
          
          .sub-service {
            margin: 8px 0 8px 20px;
            padding: 8px 15px;
            background: var(--primary-light);
            border-radius: 6px;
            color: var(--primary-color);
            font-size: 0.925rem;
          }
          
          /* Employees Section */
          .employees-section {
            margin: 40px 0;
          }
          
          .employees-section h2 {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .employee-item {
            background: white;
            padding: 12px 20px;
            margin: 8px 0;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.03);
            position: relative;
            overflow: hidden;
          }
          
          .employee-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: var(--primary-color);
            opacity: 0.2;
          }
          
          .employee-item span {
            color: #4b5563;
          }
          
          .employee-hours {
            font-weight: 600;
            color: var(--primary-color);
          }
          
          /* Total Section */
          .total-section {
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-color)dd);
            color: white;
            border-radius: 12px;
            text-align: right;
            position: relative;
            overflow: hidden;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.08);
          }
          
          .total-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at top right, white, transparent);
            opacity: 0.1;
          }
          
          .total-label {
            font-size: 1.1rem;
            margin-bottom: 5px;
          }
          
          .total-amount {
            font-size: 2rem;
            font-weight: 700;
          }
          
          /* Signature Section */
          .signature-section {
            margin-top: 50px;
            border-top: 1px solid #e5e7eb;
            padding-top: 30px;
          }
          
          .signature-section h2 {
            color: var(--primary-color);
            font-size: 1.25rem;
            margin-bottom: 20px;
            font-weight: 600;
          }
          
          .signature-image {
            max-width: 200px;
            height: auto;
            margin-top: 15px;
          }
          
          /* Footer */
          .footer {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #e5e7eb;
            font-size: 0.875rem;
            color: #6b7280;
            text-align: center;
          }
          
          .payment-terms {
            background: #f9fafb;
            padding: 15px;
            border-radius: 8px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="${
            invoice.company?.logo || ""
          }" class="company-logo" alt="Logo entreprise"/>
          <div class="company-info">
            <h3>${invoice.company?.name || ""}</h3>
            <p>${invoice.company?.address || ""}</p>
            <p>${invoice.company?.phone || ""}</p>
            <p>${invoice.company?.email || ""}</p>
            <p>SIRET: ${invoice.company?.siret || ""}</p>
          </div>
        </div>

        <h1 class="invoice-title">
          Facture
          <div class="invoice-number">N°${invoice.numberInvoice}</div>
        </h1>

        <div class="customer-grid">
          <div class="info-box">
            <h3>Informations Client</h3>
            <p><strong>${invoice.customer?.name || "Non spécifié"}</strong></p>
            <p>${invoice.customer?.address || ""}</p>
            <p>${invoice.customer?.phone || ""}</p>
            <p>${invoice.customer?.email || ""}</p>
          </div>
          <div class="info-box">
            <h3>Détails Facture</h3>
            <p><strong>Date d'émission:</strong> ${new Date(
              invoice.date
            ).toLocaleDateString()}</p>
            <p><strong>Date d'échéance:</strong> ${
              invoice.dueDate
                ? new Date(invoice.dueDate).toLocaleDateString()
                : "Non spécifié"
            }</p>
            <p><strong>Référence:</strong> ${
              invoice.reference || invoice.numberInvoice
            }</p>
            <p><strong>Mode de paiement:</strong> ${
              invoice.paymentMethod || "Non spécifié"
            }</p>
          </div>
        </div>

        ${
          invoice.associatedServices?.length
            ? `
          <div class="services-section">
            <h2>Services & Prestations</h2>
            ${invoice.associatedServices
              .map(
                (service) => `
              <div class="service-item">
                <h3>${service.name}</h3>
                ${
                  service.description
                    ? `<p class="service-description">${service.description}</p>`
                    : ""
                }
                ${invoice.selectedSubServices
                  ?.filter((sub) => sub.serviceId === service.id)
                  .map(
                    (sub) => `
                    <div class="sub-service">
                      ${sub.name} ${sub.price ? `- ${sub.price}€` : ""}
                    </div>
                  `
                  )
                  .join("")}
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          invoice.employees?.length
            ? `
          <div class="employees-section">
            <h2>Intervenants</h2>
            ${invoice.employees
              .map(
                (employee) => `
              <div class="employee-item">
                <span>${employee.name}</span>
                <span class="employee-hours">${
                  employee.InvoiceEmployee?.hours || 0
                } heures</span>
              </div>
            `
              )
              .join("")}
          </div>
        `
            : ""
        }

        ${
          invoice.totalAmount
            ? `
          <div class="total-section">
            <div class="total-label">Total TTC</div>
            <div class="total-amount">${invoice.totalAmount.toLocaleString()}€</div>
          </div>
        `
            : ""
        }

        ${
          invoice.tagline
            ? `
          <div class="signature-section">
            <h2>Signature</h2>
            <img src="${invoice.tagline}" class="signature-image" alt="Signature"/>
          </div>
        `
            : ""
        }

        <div class="footer">
          <div class="payment-terms">
            <p>En cas de retard de paiement, une pénalité de 3 fois le taux d'intérêt légal sera appliquée,</p>
            <p>à laquelle s'ajoutera une indemnité forfaitaire pour frais de recouvrement de 40€.</p>
          </div>
          <p style="margin-top: 20px;">${invoice.company?.name} - SIRET: ${
    invoice.company?.siret
  }</p>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });
    return uri;
  } catch (error) {
    console.error("Erreur génération PDF:", error);
    throw error;
  }
};

export const sharePDF = async (uri) => {
  try {
    await shareAsync(uri, {
      UTI: ".pdf",
      mimeType: "application/pdf",
    });
  } catch (error) {
    console.error("Erreur partage:", error);
    throw error;
  }
};
