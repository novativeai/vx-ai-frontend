import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaymentTransaction } from '@/types/types';

// Company information
const COMPANY_INFO = {
  name: 'Reelzila',
  tagline: 'AI Video Generation Platform',
  address: 'Digital Services',
  website: 'https://reelzila.studio',
  email: 'contact@reelzila.studio',
};

// Helper to format currency (amount followed by € with space)
const formatCurrency = (amount: number): string => {
  return `${amount.toFixed(2)} €`;
};

// Helper to format date
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

// Generate invoice number from transaction ID
const generateInvoiceNumber = (transactionId: string, date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const shortId = transactionId.slice(-8).toUpperCase();
  return `INV-${year}${month}-${shortId}`;
};

// Get transaction description based on type
const getTransactionDescription = (type?: string): string => {
  switch (type) {
    case 'Credit Purchase':
      return 'AI Video Generation Credits';
    case 'Marketplace Purchase':
      return 'Marketplace Video Purchase';
    case 'Subscription':
      return 'Subscription Payment';
    default:
      return 'Digital Services';
  }
};

// Get credits from amount (assuming €0.10 per credit for standard pricing)
const getCreditsFromAmount = (amount: number, type?: string): number | null => {
  if (type === 'Credit Purchase') {
    // Standard pricing tiers
    if (amount === 5) return 50;
    if (amount === 10) return 100;
    if (amount === 20) return 250;
    if (amount === 50) return 750;
    // Fallback calculation
    return Math.round(amount * 10);
  }
  return null;
};

export const generateTransactionPDF = (
  transaction: PaymentTransaction,
  userName: string,
  userEmail: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const rightAlign = pageWidth - margin;

  const invoiceDate = transaction.createdAt.toDate();
  const invoiceNumber = generateInvoiceNumber(transaction.id, invoiceDate);

  // Colors (black and white only)
  const blackColor: [number, number, number] = [0, 0, 0];
  const darkGrayColor: [number, number, number] = [55, 55, 55];
  const grayColor: [number, number, number] = [120, 120, 120];
  const lightGrayColor: [number, number, number] = [245, 245, 245];

  let yPos = margin;

  // ============================================
  // HEADER SECTION
  // ============================================

  // Company name (brand)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text(COMPANY_INFO.name, margin, yPos + 6);

  // Tagline
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(COMPANY_INFO.tagline, margin, yPos + 12);

  // INVOICE label (right side)
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text('INVOICE', rightAlign, yPos + 8, { align: 'right' });

  yPos += 22;

  // Horizontal line (thin, black)
  doc.setDrawColor(...blackColor);
  doc.setLineWidth(0.5);
  doc.line(margin, yPos, rightAlign, yPos);

  yPos += 12;

  // ============================================
  // INVOICE DETAILS & BILL TO SECTION
  // ============================================

  // Left column: Bill To
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayColor);
  doc.text('BILL TO', margin, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...blackColor);
  doc.text(userName || 'Customer', margin, yPos);

  yPos += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkGrayColor);
  doc.text(userEmail, margin, yPos);

  // Right column: Invoice details (pushed left by 30px more)
  const detailsLabelX = rightAlign - 90;
  let detailsY = yPos - 9;

  // Invoice Number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text('Invoice Number', detailsLabelX, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...blackColor);
  doc.text(invoiceNumber, rightAlign, detailsY, { align: 'right' });

  detailsY += 5;

  // Invoice Date
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Invoice Date', detailsLabelX, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...blackColor);
  doc.text(formatDate(invoiceDate), rightAlign, detailsY, { align: 'right' });

  detailsY += 5;

  // Payment Status (black and white only)
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Status', detailsLabelX, detailsY);

  const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...blackColor);
  doc.text(statusText, rightAlign, detailsY, { align: 'right' });

  yPos += 16;

  // ============================================
  // ITEMS TABLE
  // ============================================

  const description = getTransactionDescription(transaction.type);
  const credits = getCreditsFromAmount(transaction.amount, transaction.type);

  // Build table body
  const tableBody: (string | number)[][] = [];

  if (transaction.type === 'Credit Purchase' && credits) {
    tableBody.push([
      description,
      `${credits} credits`,
      formatCurrency(transaction.amount / credits * 100), // Price per 100 credits
      formatCurrency(transaction.amount),
    ]);
  } else if (transaction.type === 'Marketplace Purchase') {
    tableBody.push([
      description,
      '1',
      formatCurrency(transaction.amount),
      formatCurrency(transaction.amount),
    ]);
  } else {
    tableBody.push([
      description,
      '1',
      formatCurrency(transaction.amount),
      formatCurrency(transaction.amount),
    ]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Description', 'Quantity', 'Unit Price', 'Amount']],
    body: tableBody,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 6,
      textColor: darkGrayColor,
    },
    headStyles: {
      fillColor: lightGrayColor,
      textColor: blackColor,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [252, 252, 252],
    },
  });

  // Get the Y position after the table
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // ============================================
  // TOTALS SECTION
  // ============================================

  const totalsX = pageWidth - 90;

  // Subtotal
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text('Subtotal', totalsX, yPos);
  doc.setTextColor(...darkGrayColor);
  doc.text(formatCurrency(transaction.amount), rightAlign, yPos, { align: 'right' });

  yPos += 5;

  // VAT (0% for digital services or included)
  doc.setTextColor(...grayColor);
  doc.text('VAT (Included)', totalsX, yPos);
  doc.setTextColor(...darkGrayColor);
  doc.text('0.00 €', rightAlign, yPos, { align: 'right' });

  yPos += 3;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(totalsX, yPos, rightAlign, yPos);

  yPos += 6;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...blackColor);
  doc.text('Total', totalsX, yPos);
  doc.text(formatCurrency(transaction.amount), rightAlign, yPos, { align: 'right' });

  yPos += 4;

  // Paid badge if applicable (black and white)
  if (transaction.status === 'paid') {
    yPos += 8;
    doc.setFillColor(...blackColor);
    doc.roundedRect(rightAlign - 32, yPos - 5, 32, 10, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('PAID', rightAlign - 16, yPos + 1.5, { align: 'center' });
  }

  yPos += 20;

  // ============================================
  // PAYMENT INFORMATION
  // ============================================

  doc.setFillColor(...lightGrayColor);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 22, 2, 2, 'F');

  yPos += 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...blackColor);
  doc.text('Payment Information', margin + 8, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...darkGrayColor);
  doc.text(`Transaction ID: ${transaction.id}`, margin + 8, yPos);
  doc.text(`Payment Method: Online Payment`, margin + 100, yPos);

  yPos += 18;

  // ============================================
  // NOTES SECTION
  // ============================================

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...blackColor);
  doc.text('Notes', margin, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);

  const notes = [
    'Thank you for your purchase. Your credits have been added to your account.',
    'For questions about this invoice, contact contact@reelzila.studio',
    'Digital services are non-refundable as per our terms of service.',
  ];

  notes.forEach((note) => {
    doc.text(`• ${note}`, margin, yPos);
    yPos += 4;
  });

  // ============================================
  // FOOTER
  // ============================================

  const footerY = pageHeight - 18;

  // Footer line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(margin, footerY - 8, rightAlign, footerY - 8);

  // Footer text
  doc.setFontSize(7);
  doc.setTextColor(...grayColor);
  doc.text(COMPANY_INFO.website, margin, footerY);
  doc.text(COMPANY_INFO.email, pageWidth / 2, footerY, { align: 'center' });
  doc.text('Page 1 of 1', rightAlign, footerY, { align: 'right' });

  // ============================================
  // SAVE THE PDF
  // ============================================

  doc.save(`${invoiceNumber}.pdf`);
};
