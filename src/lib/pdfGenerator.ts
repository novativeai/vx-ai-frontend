import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaymentTransaction } from '@/types/types';

// Company information
const COMPANY_INFO = {
  name: 'Reelzila',
  tagline: 'AI Video Generation Platform',
  address: 'Digital Services',
  website: 'https://reelzila.studio',
  email: 'support@reelzila.studio',
};

// Helper to format currency
const formatCurrency = (amount: number): string => {
  return `€${amount.toFixed(2)}`;
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

  // Colors
  const primaryColor: [number, number, number] = [212, 255, 79]; // #D4FF4F
  const darkColor: [number, number, number] = [20, 20, 20];
  const grayColor: [number, number, number] = [100, 100, 100];
  const lightGrayColor: [number, number, number] = [240, 240, 240];

  let yPos = margin;

  // ============================================
  // HEADER SECTION
  // ============================================

  // Company name (brand)
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(COMPANY_INFO.name, margin, yPos + 8);

  // Tagline
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text(COMPANY_INFO.tagline, margin, yPos + 15);

  // INVOICE label (right side)
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text('INVOICE', rightAlign, yPos + 10, { align: 'right' });

  yPos += 30;

  // Horizontal line with brand color
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(3);
  doc.line(margin, yPos, rightAlign, yPos);

  yPos += 15;

  // ============================================
  // INVOICE DETAILS & BILL TO SECTION
  // ============================================

  // Left column: Bill To
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...grayColor);
  doc.text('BILL TO', margin, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...darkColor);
  doc.text(userName || 'Customer', margin, yPos);

  yPos += 5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text(userEmail, margin, yPos);

  // Right column: Invoice details
  const detailsX = rightAlign - 60;
  let detailsY = yPos - 11;

  // Invoice Number
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('Invoice Number:', detailsX, detailsY);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...darkColor);
  doc.text(invoiceNumber, rightAlign, detailsY, { align: 'right' });

  detailsY += 6;

  // Invoice Date
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Invoice Date:', detailsX, detailsY);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  doc.text(formatDate(invoiceDate), rightAlign, detailsY, { align: 'right' });

  detailsY += 6;

  // Payment Status
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...grayColor);
  doc.text('Status:', detailsX, detailsY);

  const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
  if (transaction.status === 'paid') {
    doc.setTextColor(34, 197, 94); // Green
  } else if (transaction.status === 'pending') {
    doc.setTextColor(234, 179, 8); // Yellow
  } else {
    doc.setTextColor(239, 68, 68); // Red
  }
  doc.setFont('helvetica', 'bold');
  doc.text(statusText, rightAlign, detailsY, { align: 'right' });

  yPos += 20;

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
      fontSize: 10,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: lightGrayColor,
      textColor: darkColor,
      fontStyle: 'bold',
      fontSize: 10,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 35, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 35, halign: 'right' },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
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
  doc.setFontSize(10);
  doc.setTextColor(...grayColor);
  doc.text('Subtotal:', totalsX, yPos);
  doc.setTextColor(...darkColor);
  doc.text(formatCurrency(transaction.amount), rightAlign, yPos, { align: 'right' });

  yPos += 6;

  // VAT (0% for digital services or included)
  doc.setTextColor(...grayColor);
  doc.text('VAT (Included):', totalsX, yPos);
  doc.setTextColor(...darkColor);
  doc.text('€0.00', rightAlign, yPos, { align: 'right' });

  yPos += 2;

  // Divider line
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(totalsX, yPos, rightAlign, yPos);

  yPos += 8;

  // Total
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...darkColor);
  doc.text('TOTAL:', totalsX, yPos);
  doc.text(formatCurrency(transaction.amount), rightAlign, yPos, { align: 'right' });

  yPos += 5;

  // Paid badge if applicable
  if (transaction.status === 'paid') {
    yPos += 10;
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(rightAlign - 40, yPos - 6, 40, 12, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text('PAID', rightAlign - 20, yPos + 2, { align: 'center' });
  }

  yPos += 25;

  // ============================================
  // PAYMENT INFORMATION
  // ============================================

  doc.setFillColor(...lightGrayColor);
  doc.roundedRect(margin, yPos, pageWidth - (margin * 2), 25, 3, 3, 'F');

  yPos += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text('Payment Information', margin + 8, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);
  doc.text(`Transaction ID: ${transaction.id}`, margin + 8, yPos);
  doc.text(`Payment Method: Online Payment`, margin + 100, yPos);

  yPos += 20;

  // ============================================
  // NOTES SECTION
  // ============================================

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text('Notes', margin, yPos);

  yPos += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...grayColor);

  const notes = [
    'Thank you for your purchase! Your credits have been added to your account.',
    'For any questions about this invoice, please contact support@reelzila.studio',
    'Digital services are non-refundable as per our terms of service.',
  ];

  notes.forEach((note) => {
    doc.text(`• ${note}`, margin, yPos);
    yPos += 5;
  });

  // ============================================
  // FOOTER
  // ============================================

  const footerY = pageHeight - 20;

  // Footer line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(margin, footerY - 10, rightAlign, footerY - 10);

  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(...grayColor);
  doc.text(COMPANY_INFO.website, margin, footerY);
  doc.text(COMPANY_INFO.email, pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Page 1 of 1`, rightAlign, footerY, { align: 'right' });

  // ============================================
  // SAVE THE PDF
  // ============================================

  doc.save(`${invoiceNumber}.pdf`);
};
