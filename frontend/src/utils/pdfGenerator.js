import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateCertificatePDF = (certificate) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // Add border
  doc.setLineWidth(2);
  doc.rect(10, 10, 277, 190);

  // Add decorative inner border
  doc.setLineWidth(0.5);
  doc.rect(15, 15, 267, 180);

  // Title
  doc.setFontSize(32);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", 148.5, 40, { align: "center" });

  // Certificate type
  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text(`of ${certificate.certificate_type}`, 148.5, 55, {
    align: "center",
  });

  // Divider line
  doc.setLineWidth(0.5);
  doc.line(80, 60, 217, 60);

  // This is to certify that
  doc.setFontSize(14);
  doc.text("This is to certify that", 148.5, 75, { align: "center" });

  // Recipient name
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text(certificate.recipient_name, 148.5, 90, { align: "center" });

  // Certificate content/description
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const description = `has been awarded this certificate by NVP Welfare Foundation India`;
  doc.text(description, 148.5, 105, { align: "center", maxWidth: 200 });

  // Certificate details
  doc.setFontSize(10);
  doc.text(
    `Certificate Number: ${certificate.certificate_number}`,
    148.5,
    125,
    { align: "center" },
  );
  doc.text(
    `Issue Date: ${new Date(certificate.issue_date).toLocaleDateString()}`,
    148.5,
    135,
    { align: "center" },
  );

  // Organization details
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("NVP Welfare Foundation India", 148.5, 160, { align: "center" });
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    "नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान – 303303",
    148.5,
    167,
    { align: "center" },
  );
  doc.text(
    "Phone: 78776 43155 | Email: nvpwfoundationindia@gmail.com",
    148.5,
    173,
    { align: "center" },
  );

  // Signature line
  doc.line(180, 150, 240, 150);
  doc.setFontSize(10);
  doc.text("Authorized Signature", 210, 155, { align: "center" });

  // Footer note
  doc.setFontSize(8);
  doc.text(
    "This is a computer-generated certificate and does not require a signature.",
    148.5,
    185,
    { align: "center" },
  );

  return doc;
};

export const generateReceiptPDF = (receipt) => {
  const doc = new jsPDF();

  // Header background
  doc.setFillColor(15, 118, 110); // Primary color
  doc.rect(0, 0, 210, 40, "F");

  // Logo/Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NVP Welfare Foundation India", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    "नारायण निवास, बजरंग नगर, मोड़ा बालाजी रोड, दौसा, राजस्थान – 303303",
    105,
    30,
    {
      align: "center",
    },
  );

  // Reset text color
  doc.setTextColor(0, 0, 0);

  // Receipt title
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("RECEIPT", 105, 55, { align: "center" });

  // Receipt details box
  doc.setLineWidth(0.5);
  doc.rect(15, 65, 180, 80);

  // Receipt number (highlighted)
  doc.setFillColor(250, 250, 249);
  doc.rect(15, 65, 180, 15, "F");
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Receipt No: ${receipt.receipt_number}`, 20, 75);

  // Receipt details
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  let yPos = 90;
  const lineHeight = 8;

  doc.text("Receipt Type:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(receipt.receipt_type || "General", 70, yPos);
  doc.setFont("helvetica", "normal");

  yPos += lineHeight;
  doc.text("Recipient Name:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.text(receipt.recipient_name, 70, yPos);
  doc.setFont("helvetica", "normal");

  yPos += lineHeight;
  doc.text("Amount:", 20, yPos);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(`₹ ${receipt.amount}`, 70, yPos);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");

  yPos += lineHeight;
  doc.text("Date:", 20, yPos);
  doc.text(new Date(receipt.created_at).toLocaleDateString(), 70, yPos);

  yPos += lineHeight;
  doc.text("Description:", 20, yPos);
  const descLines = doc.splitTextToSize(receipt.description || "N/A", 115);
  doc.text(descLines, 70, yPos);

  // Tax benefit note (if applicable)
  if (receipt.receipt_type === "donation") {
    doc.setFillColor(249, 115, 22); // Secondary color
    doc.rect(15, 155, 180, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("This donation is eligible for 80G tax benefits", 105, 165, {
      align: "center",
    });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Please retain this receipt for tax filing purposes", 105, 171, {
      align: "center",
    });
    doc.setTextColor(0, 0, 0);
  }

  // Contact details
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  const contactY = receipt.receipt_type === "donation" ? 185 : 165;
  doc.text(
    "Contact: 78776 43155 | Email: nvpwfoundationindia@gmail.com",
    105,
    contactY,
    {
      align: "center",
    },
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text(
    "This is a computer-generated receipt and does not require a signature.",
    105,
    contactY + 10,
    { align: "center" },
  );
  doc.text(
    "For queries, please contact us at the above details.",
    105,
    contactY + 15,
    { align: "center" },
  );

  // QR Code placeholder note
  doc.setFontSize(9);
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Scan QR code to verify: Visit nvpwelfare.in/verify",
    105,
    contactY + 25,
    { align: "center" },
  );

  return doc;
};

export const downloadCertificatePDF = (certificate) => {
  const doc = generateCertificatePDF(certificate);
  doc.save(`Certificate-${certificate.certificate_number}.pdf`);
};

export const downloadReceiptPDF = (receipt) => {
  const doc = generateReceiptPDF(receipt);
  doc.save(`Receipt-${receipt.receipt_number}.pdf`);
};
