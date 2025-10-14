import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PaymentTransaction } from '@/types/types'; // Import the type from your main app's types file

export const generateTransactionPDF = (transaction: PaymentTransaction, userName: string, userEmail: string) => {
  const doc = new jsPDF();

  // Add a title
  doc.setFontSize(22);
  doc.text("Transaction Invoice", 14, 22);

  // Add user and transaction details
  doc.setFontSize(11);
  doc.text(`Billed to: ${userName} (${userEmail})`, 14, 32);
  doc.text(`Transaction ID: ${transaction.id}`, 14, 38);

  // Use autoTable to create a clean table
  autoTable(doc, {
    startY: 50,
    head: [['Detail', 'Value']],
    body: [
      ['Date', transaction.createdAt.toDate().toLocaleDateString()],
      ['Amount', `${transaction.amount}€`],
      ['Type', transaction.type || 'Purchase'],
      ['Status', transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)],
    ],
    theme: 'grid',
    headStyles: { fillColor: [22, 22, 22] }, // Dark header
  });

  // Save the PDF
  doc.save(`invoice-${transaction.id}.pdf`);
};