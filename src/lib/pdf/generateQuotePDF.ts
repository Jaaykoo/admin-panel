import type { QuoteDetail } from '@/types/QuoteTypes';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { COMPANY_INFO } from '@/config/company';

export async function generateQuotePDF(quote: QuoteDetail) {
  // eslint-disable-next-line new-cap
  const doc = new jsPDF();

  // Couleurs
  const primaryColor: [number, number, number] = [0, 158, 247]; // #009ef7
  const darkGray: [number, number, number] = [55, 65, 81]; // gray-700
  const mediumGray: [number, number, number] = [107, 114, 128]; // gray-500
  const lightGray: [number, number, number] = [243, 244, 246]; // gray-100

  let yPos = 25;

  // ==================== 1. HEADER ====================

  // Logo de l'entreprise
  try {
    // Charger le logo depuis /public/Logo.svg
    const logoImg = new Image();
    logoImg.src = '/Logo.svg';

    await new Promise<void>((resolve, reject) => {
      logoImg.onload = () => {
        try {
          // Créer un canvas pour convertir le SVG en image
          const canvas = document.createElement('canvas');
          canvas.width = 300;
          canvas.height = 150;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            // Fond blanc
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Dessiner l'image avec le filtre bleu
            ctx.filter = 'brightness(0) saturate(100%) invert(45%) sepia(97%) saturate(2439%) hue-rotate(178deg) brightness(98%) contrast(101%)';
            ctx.drawImage(logoImg, 0, 0, canvas.width, canvas.height);

            // Convertir en data URL
            const imgData = canvas.toDataURL('image/png');

            // Ajouter au PDF (largeur: 50mm, hauteur: 16mm)
            doc.addImage(imgData, 'PNG', 20, yPos - 10, 50, 16);
          }
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      logoImg.onerror = reject;

      // Timeout de 2 secondes
      setTimeout(() => reject(new Error('Logo loading timeout')), 2000);
    });
  } catch (error) {
    console.warn('Could not load logo, using text fallback:', error);
    // Fallback: Box bleue avec texte JABA
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(20, yPos - 10, 50, 16, 2, 2, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('Jaaykoo', 45, yPos + 2, { align: 'center' });
  }

  // Numéro de devis (à droite)
  doc.setFontSize(12);
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(quote.quote_number, 190, yPos, { align: 'right' });

  yPos += 12;

  // Infos entreprise (gauche) - Décalé légèrement à droite
  const infoX = 23; // Décalé de 20 à 23 (3pt vers la droite)

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(COMPANY_INFO.ownerName, infoX, yPos);
  yPos += 6; // Augmenté de 4 à 6 pour plus d'espace

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text(COMPANY_INFO.email, infoX, yPos);
  yPos += 6; // Augmenté de 4 à 6 pour plus d'espace
  doc.text(COMPANY_INFO.phone, infoX, yPos);
  yPos += 6; // Augmenté de 4 à 6 pour plus d'espace
  doc.text(COMPANY_INFO.address, infoX, yPos);
  yPos += 6; // Augmenté de 4 à 6 pour plus d'espace

  // Ligne de séparation
  yPos += 6; // Réduit de 8 à 6
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(20, yPos, 190, yPos);
  yPos += 6; // Réduit de 8 à 6

  // ==================== 2. INFOS SECTION (2 colonnes) ====================

  const col1X = 20;
  const col2X = 110;
  const startYInfos = yPos;

  // Colonne 1 : Informations devis (encadré)
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(col1X, yPos, 85, 40, 'F');

  yPos += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Informations devis', col1X + 5, yPos);

  yPos += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);

  if (quote.responded_at) {
    doc.text('Date de proposition', col1X + 5, yPos);
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(formatDate(quote.responded_at), col1X + 5, yPos + 5); // Augmenté de 4 à 5
    doc.setFontSize(9);
    yPos += 12; // Augmenté de 10 à 12
  }

  if (quote.expiration_date) {
    doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
    doc.text('Date de fin de validité', col1X + 5, yPos);
    doc.setFontSize(10);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text(formatDate(quote.expiration_date), col1X + 5, yPos + 5); // Augmenté de 4 à 5
  }

  // Colonne 2 : Coordonnées du client
  yPos = startYInfos + 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Coordonnées du client', col2X, yPos);

  yPos += 8;
  doc.setFontSize(9);

  // Raison sociale
  const companyName = quote.customer.user_profile.company_name
    || `${quote.customer.user_profile.first_name} ${quote.customer.user_profile.last_name}`;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Raison sociale: ', col2X, yPos);
  doc.setFont('helvetica', 'normal');
  const companyNameWidth = doc.getTextWidth('Raison sociale: ');
  doc.text(companyName, col2X + companyNameWidth, yPos);
  yPos += 5;

  // Email
  if (quote.customer.email) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('Email: ', col2X, yPos);
    doc.setFont('helvetica', 'normal');
    const emailWidth = doc.getTextWidth('Email: ');
    doc.text(quote.customer.email, col2X + emailWidth, yPos);
    yPos += 5;
  }

  // Téléphone
  if (quote.customer.phone_number) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('Téléphone: ', col2X, yPos);
    doc.setFont('helvetica', 'normal');
    const phoneWidth = doc.getTextWidth('Téléphone: ');
    doc.text(quote.customer.phone_number, col2X + phoneWidth, yPos);
    yPos += 5;
  }

  // Adresse
  if (quote.customer.address?.line1) {
    const addressParts = [
      quote.customer.address.line1,
      // quote.customer.address.line2,
      // quote.customer.address.line3,
      quote.customer.address.line4,
      // quote.customer.address.state,
      // quote.customer.address.postcode,
    ].filter(Boolean).join(', ');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('Addresse: ', col2X, yPos);
    doc.setFont('helvetica', 'normal');
    const addressWidth = doc.getTextWidth('Addresse: ');
    doc.text(addressParts, col2X + addressWidth, yPos);
  }

  yPos = startYInfos + 48; // Augmenté de 42 à 48

  // ==================== 3. TABLEAU DES ARTICLES ====================

  const tableData = quote.items.map((item, index) => {
    const unitPriceHT = Number.parseFloat(item.unit_price);
    const tva = Number.parseFloat(item.rate);
    const amountHT = unitPriceHT * item.quantity;
    const amountTTC = amountHT * (1 + tva / 100);

    return [
      (index + 1).toString(),
      item.title || item.product_detail?.title || '',
      item.product_detail?.code || '',
      item.quantity.toString(),
      `${unitPriceHT.toFixed(2)} XOF`,
      `${tva.toFixed(0)}%`,
      `${amountHT.toFixed(0)} XOF`,
      `${amountTTC.toFixed(0)} XOF`,
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [['N°', 'Désignation', 'Référence', 'Quantité', 'Prix unité HT', 'TVA', 'Montant HT', 'Montant TTC']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 3,
      minCellHeight: 8,
    },
    headStyles: {
      fillColor: [243, 244, 246],
      textColor: [55, 65, 81],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'left',
      minCellHeight: 10,
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 10 },
      1: { halign: 'left', cellWidth: 45 },
      2: { halign: 'left', cellWidth: 25 },
      3: { halign: 'center', cellWidth: 18 },
      4: { halign: 'right', cellWidth: 25 },
      5: { halign: 'center', cellWidth: 15 },
      6: { halign: 'right', cellWidth: 25 },
      7: { halign: 'right', cellWidth: 25 },
    },
  });

  // @ts-expect-error - autoTable ajoute finalY
  yPos = doc.lastAutoTable.finalY + 12; // Augmenté de 8 à 12

  // ==================== 4. TOTAUX (aligné à droite) ====================

  // Calculer les totaux à partir des items
  let totalHT = 0;
  let totalTVA = 0;
  let totalTTC = 0;

  quote.items.forEach((item) => {
    const unitPriceHT = Number.parseFloat(item.unit_price);
    const tva = Number.parseFloat(item.rate);
    const amountHT = unitPriceHT * item.quantity;
    const amountTVA = amountHT * (tva / 100);
    const amountTTC = amountHT + amountTVA;

    totalHT += amountHT;
    totalTVA += amountTVA;
    totalTTC += amountTTC;
  });

  // Calculer le taux de TVA moyen (pour l'affichage)
  const avgTVARate = totalHT > 0 ? (totalTVA / totalHT) * 100 : 0;

  const boxX = 130;
  const boxWidth = 60;

  // Fond gris clair
  doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.rect(boxX, yPos, boxWidth, 35, 'F');

  yPos += 8;

  // Sous-total HT
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text('Sous-total HT', boxX + 5, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`${totalHT.toFixed(0)} FCFA`, boxX + boxWidth - 5, yPos, { align: 'right' });

  yPos += 7;

  // TVA avec pourcentage
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.text(`TVA (${avgTVARate.toFixed(0)} %)`, boxX + 5, yPos);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text(`${totalTVA.toFixed(0)} FCFA`, boxX + boxWidth - 5, yPos, { align: 'right' });

  yPos += 7;

  // Ligne de séparation
  doc.setDrawColor(mediumGray[0], mediumGray[1], mediumGray[2]);
  doc.line(boxX + 5, yPos, boxX + boxWidth - 5, yPos);

  yPos += 7;

  // Total TTC
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
  doc.text('Total TTC', boxX + 5, yPos);
  doc.setFontSize(14);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${totalTTC.toFixed(0)} FCFA`, boxX + boxWidth - 5, yPos, { align: 'right' });

  yPos += 25;

  // ==================== 5. FOOTER ====================

  // Ligne de séparation
  doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
  doc.line(20, yPos, 190, yPos);
  yPos += 10; // Augmenté de 6 à 10

  doc.setFontSize(10); // Augmenté de 9 à 10
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(mediumGray[0], mediumGray[1], mediumGray[2]);

  const footerNote = quote.expiration_date
    ? `Ce devis est valable jusqu'au ${formatDate(quote.expiration_date)}.`
    : 'Veuillez répondre dans les 15 jours suivant la réception de devis.';

  const splitFooter = doc.splitTextToSize(footerNote, 170);
  // Centrer le texte (105 = milieu de la page entre 20 et 190)
  doc.text(splitFooter, 105, yPos, { align: 'center' });

  // Sauvegarder le PDF
  doc.save(`devis_${quote.quote_number}.pdf`);
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
