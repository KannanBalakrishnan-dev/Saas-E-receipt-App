import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const BRAND_TEAL = [15, 110, 108]; // #0F6E6C

function slugify(text) {
  return (text || 'receipt')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatDate(date) {
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Creates and downloads a PDF receipt.
 * @param {object} receipt - { customerName, phone, workDetails, amount, receiptNumber, date }
 * @param {object} settings - { businessName, ownerName, phone, address, upiId }
 */
export function createPDF(receipt, settings) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 40;
  let cursorY = 50;

  // Business name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(...BRAND_TEAL);
  doc.text(settings.businessName || 'Your Business Name', marginX, cursorY);
  cursorY += 22;

  // Owner / phone / address
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  if (settings.ownerName) {
    doc.text(settings.ownerName, marginX, cursorY);
    cursorY += 14;
  }
  if (settings.phone) {
    doc.text(settings.phone, marginX, cursorY);
    cursorY += 14;
  }
  if (settings.address) {
    doc.text(settings.address, marginX, cursorY);
    cursorY += 14;
  }

  cursorY += 10;

  // SERVICE RECEIPT title bar
  doc.setFillColor(...BRAND_TEAL);
  doc.rect(marginX, cursorY, pageWidth - marginX * 2, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('SERVICE RECEIPT', marginX + 10, cursorY + 19);
  cursorY += 28 + 20;

  // Receipt number + date row
  const receiptNumber = receipt.receiptNumber || 'RCPT-0001';
  const date = receipt.date ? new Date(receipt.date) : new Date();

  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`Receipt No: ${receiptNumber}`, marginX, cursorY);
  doc.text(formatDate(date), pageWidth - marginX - 90, cursorY);
  cursorY += 20;

  // Customer table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['Customer Name', 'Phone']],
    body: [[receipt.customerName || '-', receipt.phone || '-']],
    theme: 'grid',
    headStyles: { fillColor: BRAND_TEAL, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 6 },
  });

  cursorY = doc.lastAutoTable.finalY + 16;

  // Service table
  autoTable(doc, {
    startY: cursorY,
    margin: { left: marginX, right: marginX },
    head: [['No', 'Work Details', 'Amount']],
    body: [['1', receipt.workDetails || '-', `Rs. ${Number(receipt.amount || 0).toLocaleString('en-IN')}`]],
    theme: 'grid',
    headStyles: { fillColor: BRAND_TEAL, textColor: 255 },
    styles: { fontSize: 10, cellPadding: 6 },
    columnStyles: {
      0: { cellWidth: 30 },
      2: { cellWidth: 90, halign: 'right' },
    },
  });

  cursorY = doc.lastAutoTable.finalY + 24;

  // Total amount, bold, right-aligned
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...BRAND_TEAL);
  const totalText = `Total: Rs. ${Number(receipt.amount || 0).toLocaleString('en-IN')}`;
  const totalWidth = doc.getTextWidth(totalText);
  doc.text(totalText, pageWidth - marginX - totalWidth, cursorY);
  cursorY += 24;

  // Optional UPI line
  if (settings.upiId) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`UPI ID: ${settings.upiId}`, marginX, cursorY);
    cursorY += 20;
  }

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  doc.text('Thank you for choosing our service', marginX, cursorY + 10);

  const filename = `${slugify(receipt.customerName)}-receipt.pdf`;
  doc.save(filename);
}