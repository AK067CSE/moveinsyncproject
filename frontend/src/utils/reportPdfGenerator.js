import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ============================================
// CLIENT REPORT PDF GENERATION
// ============================================
export const generateClientReportPDF = (report, clientName) => {
  const doc = new jsPDF();
  
  // Professional header with gradient effect
  doc.setFillColor(41, 128, 185); // Professional blue
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('CLIENT REPORT', 20, 25);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('MoveInSync Billing Platform', 20, 33);
  doc.text('Comprehensive Monthly Report', 20, 39);
  
  // Report date on top right (larger and clearer)
  doc.setFontSize(10);
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 165, 25, { align: 'right' });
  
  // Client Details Box
  doc.setFillColor(245, 245, 245);
  doc.rect(20, 50, 170, 35, 'F');
  doc.setTextColor(40, 40, 40);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Client Information', 25, 58);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('Client Name:', 25, 68);
  doc.text('Billing Period:', 25, 76);
  doc.text('Total Trips:', 120, 68);
  doc.text('Total Amount:', 120, 76);
  
  doc.setFont(undefined, 'normal');
  doc.text(`${clientName || 'N/A'}`, 60, 68);
  doc.text(`${new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} ${report.year}`, 60, 76);
  doc.text(`${report.totalTrips || 0}`, 150, 68);
  doc.setTextColor(41, 128, 185);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${(report.totalAmount || 0).toLocaleString('en-IN')}`, 150, 76);
  
  // Summary Stats with better visibility
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text('Summary Statistics', 20, 100);
  
  doc.setTextColor(40, 40, 40);
  
  // Summary boxes with better spacing and larger text
  const summaryY = 110;
  
  // Box 1: Total Trips
  doc.setFillColor(230, 240, 250);
  doc.setDrawColor(41, 128, 185);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, summaryY, 55, 30, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Total Trips', 25, summaryY + 10);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text(`${report.totalTrips || 0}`, 25, summaryY + 24);
  
  // Box 2: Total Vendors
  doc.setTextColor(40, 40, 40);
  doc.setFillColor(230, 240, 250);
  doc.roundedRect(80, summaryY, 55, 30, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Total Vendors', 85, summaryY + 10);
  doc.setFontSize(20);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(41, 128, 185);
  doc.text(`${report.vendorReports?.length || 0}`, 85, summaryY + 24);
  
  // Box 3: Total Amount (highlighted)
  doc.setTextColor(40, 40, 40);
  doc.setFillColor(41, 128, 185);
  doc.roundedRect(140, summaryY, 50, 30, 3, 3, 'F');
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Total Amount', 145, summaryY + 10);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${(report.totalAmount || 0).toLocaleString('en-IN')}`, 145, summaryY + 24);
  
  // Vendor Breakdown Table
  if (report.vendorReports && report.vendorReports.length > 0) {
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Vendor-wise Breakdown', 20, 155);
    
    const tableData = report.vendorReports.map(vendor => [
      vendor.vendorName || 'N/A',
      vendor.totalTrips || 0,
      `${(vendor.totalDistance || 0).toFixed(1)} km`,
      `${(vendor.totalDuration || 0).toFixed(1)} hrs`,
      `₹${(vendor.baseBilling || 0).toLocaleString('en-IN')}`,
      `₹${(vendor.totalIncentives || 0).toLocaleString('en-IN')}`,
      `₹${(vendor.totalAmount || 0).toLocaleString('en-IN')}`
    ]);
    
    autoTable(doc, {
      startY: 160,
      head: [['Vendor', 'Trips', 'Distance', 'Duration', 'Base', 'Incentives', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center',
        textColor: [255, 255, 255]
      },
      styles: {
        fontSize: 9,
        cellPadding: 5,
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { halign: 'center', cellWidth: 15 },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'right', cellWidth: 25 },
        5: { halign: 'right', cellWidth: 25 },
        6: { halign: 'right', fontStyle: 'bold', cellWidth: 25 }
      }
    });
    
    // Total row with better visibility
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFillColor(41, 128, 185);
    doc.rect(120, finalY, 70, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('GRAND TOTAL:', 125, finalY + 10);
    doc.setFontSize(14);
    doc.text(`₹${(report.totalAmount || 0).toLocaleString('en-IN')}`, 185, finalY + 10, { align: 'right' });
  }
  
  // Footer with better visibility
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 275, 190, 275);
  doc.setFontSize(9);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text('This is an auto-generated report from MoveInSync Billing Platform', 105, 281, { align: 'center' });
  doc.setFontSize(8);
  doc.text(`Report ID: CLIENT-${report.clientId}-${report.month}${report.year} | Generated: ${new Date().toLocaleString()}`, 105, 286, { align: 'center' });
  
  return doc;
};

// ============================================
// VENDOR REPORT PDF GENERATION
// ============================================
export const generateVendorReportPDF = (report) => {
  const doc = new jsPDF();
  
  // Professional header with strong branding
  doc.setFillColor(46, 204, 113); // Green
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(34);
  doc.setFont(undefined, 'bold');
  doc.text('VENDOR REPORT', 20, 25);
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('MoveInSync Billing Platform', 20, 33);
  doc.text('Monthly Billing Statement', 20, 39);
  
  // Report metadata - larger and clearer
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 165, 25, { align: 'right' });
  doc.setFont(undefined, 'normal');
  doc.text(`Period: ${new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} ${report.year}`, 165, 31, { align: 'right' });
  
  // Vendor info box - more prominent
  doc.setDrawColor(46, 204, 113);
  doc.setLineWidth(1);
  doc.setFillColor(245, 245, 245);
  doc.roundedRect(20, 55, 170, 35, 3, 3, 'FD');
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'bold');
  doc.text('VENDOR DETAILS', 25, 65);
  
  doc.setFontSize(16);
  doc.setTextColor(46, 204, 113);
  doc.setFont(undefined, 'bold');
  doc.text(report.vendorName || 'N/A', 25, 76);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Vendor ID: ${report.vendorId} | Billing Period: ${new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} ${report.year}`, 25, 84);
  
  // Stats cards with better visibility
  const statsY = 100;
  const cardWidth = 42;
  const cardHeight = 32;
  const gap = 5;
  
  // Card 1: Total Trips
  doc.setFillColor(230, 250, 240);
  doc.setDrawColor(46, 204, 113);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, statsY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Total Trips', 23, statsY + 8);
  doc.setFontSize(20);
  doc.setTextColor(46, 204, 113);
  doc.setFont(undefined, 'bold');
  doc.text(`${report.totalTrips || 0}`, 23, statsY + 24);
  
  // Card 2: Total Distance
  doc.setFillColor(230, 250, 240);
  doc.roundedRect(20 + cardWidth + gap, statsY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Distance (km)', 70, statsY + 8);
  doc.setFontSize(16);
  doc.setTextColor(46, 204, 113);
  doc.setFont(undefined, 'bold');
  doc.text(`${(report.totalDistance || 0).toFixed(1)}`, 70, statsY + 24);
  
  // Card 3: Total Duration
  doc.setFillColor(230, 250, 240);
  doc.roundedRect(20 + (cardWidth + gap) * 2, statsY, cardWidth, cardHeight, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Duration (hrs)', 117, statsY + 8);
  doc.setFontSize(16);
  doc.setTextColor(46, 204, 113);
  doc.setFont(undefined, 'bold');
  doc.text(`${(report.totalDuration || 0).toFixed(1)}`, 117, statsY + 24);
  
  // Card 4: Total Amount (highlighted and larger)
  doc.setFillColor(46, 204, 113);
  doc.roundedRect(20 + (cardWidth + gap) * 3, statsY, cardWidth + 12, cardHeight, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, 'normal');
  doc.text('Total Amount', 166, statsY + 8);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${(report.totalAmount || 0).toLocaleString('en-IN')}`, 166, statsY + 24);
  
  // Billing Breakdown Table
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Billing Breakdown', 20, 145);
  
  const billingData = [
    ['Base Billing', `₹${(report.baseBilling || 0).toLocaleString('en-IN')}`],
    ['Total Incentives', `₹${(report.totalIncentives || 0).toLocaleString('en-IN')}`],
    ['Total Amount', `₹${(report.totalAmount || 0).toLocaleString('en-IN')}`]
  ];
  
  autoTable(doc, {
    startY: 150,
    body: billingData,
    theme: 'grid',
    styles: {
      fontSize: 11,
      cellPadding: 8,
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 100, textColor: [60, 60, 60] },
      1: { halign: 'right', fontStyle: 'bold', textColor: [46, 204, 113], fontSize: 12 }
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    }
  });
  
  // Summary box - larger and more prominent
  const summaryY = doc.lastAutoTable.finalY + 20;
  doc.setFillColor(46, 204, 113);
  doc.roundedRect(90, summaryY, 100, 22, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.text('FINAL BILLING AMOUNT:', 95, summaryY + 10);
  doc.setFontSize(18);
  doc.text(`₹${(report.totalAmount || 0).toLocaleString('en-IN')}`, 185, summaryY + 16, { align: 'right' });
  
  // Footer with better visibility
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 275, 190, 275);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Questions? Contact: billing@moveinsync.com', 105, 281, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text(`Report ID: VENDOR-${report.vendorId}-${report.month}${report.year} | Generated: ${new Date().toLocaleString()}`, 105, 286, { align: 'center' });
  
  return doc;
};

// ============================================
// EMPLOYEE REPORT PDF GENERATION
// ============================================
export const generateEmployeeReportPDF = (report) => {
  const doc = new jsPDF();
  
  // Professional header with purple gradient
  doc.setFillColor(94, 53, 177); // Purple
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont(undefined, 'bold');
  doc.text('EMPLOYEE INCENTIVE REPORT', 105, 23, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text('MoveInSync Billing Platform', 105, 32, { align: 'center' });
  doc.text('Monthly Incentive Statement', 105, 38, { align: 'center' });
  
  // Decorative accent lines
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(1.5);
  doc.line(70, 27, 140, 27);
  
  // Info cards with better visibility
  doc.setFillColor(245, 245, 245);
  doc.setDrawColor(94, 53, 177);
  doc.setLineWidth(0.5);
  doc.roundedRect(30, 55, 70, 25, 3, 3, 'FD');
  doc.roundedRect(110, 55, 70, 25, 3, 3, 'FD');
  
  doc.setTextColor(94, 53, 177);
  doc.setFontSize(9);
  doc.setFont(undefined, 'bold');
  doc.text('REPORT DATE', 35, 63);
  doc.text('BILLING PERIOD', 115, 63);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(11);
  doc.setFont(undefined, 'normal');
  doc.text(new Date().toLocaleDateString(), 35, 73);
  doc.text(`${new Date(2000, report.month - 1).toLocaleString('default', { month: 'long' })} ${report.year}`, 115, 73);
  
  // Employee details - more prominent
  doc.setFillColor(245, 240, 253);
  doc.setDrawColor(94, 53, 177);
  doc.setLineWidth(1);
  doc.roundedRect(20, 90, 170, 30, 3, 3, 'FD');
  
  doc.setTextColor(94, 53, 177);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('EMPLOYEE DETAILS', 25, 98);
  
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text(report.employeeName || 'N/A', 25, 108);
  
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Employee ID: ${report.employeeId}`, 25, 115);
  
  // Stats section header
  doc.setTextColor(94, 53, 177);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Performance Summary', 20, 135);
  
  // Performance cards with better spacing
  const perfY = 145;
  
  // Card 1: Total Trips
  doc.setFillColor(245, 240, 253);
  doc.setDrawColor(94, 53, 177);
  doc.setLineWidth(0.5);
  doc.roundedRect(20, perfY, 55, 35, 3, 3, 'FD');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Total Trips', 25, perfY + 10);
  doc.setTextColor(94, 53, 177);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text(`${report.totalTrips || 0}`, 25, perfY + 26);
  
  // Card 2: Extra Hours
  doc.setFillColor(245, 240, 253);
  doc.roundedRect(80, perfY, 55, 35, 3, 3, 'FD');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Extra Hours', 85, perfY + 10);
  doc.setTextColor(94, 53, 177);
  doc.setFontSize(22);
  doc.setFont(undefined, 'bold');
  doc.text(`${(report.totalExtraHours || 0).toFixed(1)}`, 85, perfY + 26);
  
  // Card 3: Incentive (highlighted and larger)
  doc.setFillColor(94, 53, 177);
  doc.roundedRect(140, perfY, 50, 35, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('Incentive', 145, perfY + 10);
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text(`₹${(report.totalIncentive || 0).toLocaleString('en-IN')}`, 145, perfY + 26);
  
  // Incentive Details Table
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Incentive Calculation Details', 20, 195);
  
  const incentiveData = [
    ['Total Trips Completed', `${report.totalTrips || 0} trips`],
    ['Total Extra Hours Worked', `${(report.totalExtraHours || 0).toFixed(2)} hours`],
    ['Incentive Rate (per extra hour)', '₹150.00'],
    ['Total Incentive Earned', `₹${(report.totalIncentive || 0).toLocaleString('en-IN')}`]
  ];
  
  autoTable(doc, {
    startY: 200,
    body: incentiveData,
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 6,
      lineWidth: 0.1,
      lineColor: [200, 200, 200]
    },
    columnStyles: {
      0: { cellWidth: 110, fontStyle: 'bold', textColor: [60, 60, 60] },
      1: { halign: 'right', cellWidth: 60, fontStyle: 'bold', textColor: [94, 53, 177], fontSize: 11 }
    },
    alternateRowStyles: {
      fillColor: [248, 245, 252]
    }
  });
  
  // Grand total box - larger and more prominent
  const totalY = doc.lastAutoTable.finalY + 20;
  doc.setFillColor(94, 53, 177);
  doc.roundedRect(55, totalY, 100, 28, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.text('TOTAL INCENTIVE EARNED:', 60, totalY + 12);
  doc.setFontSize(20);
  doc.text(`₹${(report.totalIncentive || 0).toLocaleString('en-IN')}`, 150, totalY + 22, { align: 'right' });
  
  // Footer with better visibility
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(20, 275, 190, 275);
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont(undefined, 'normal');
  doc.text('Thank you for your excellent service and dedication.', 105, 281, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.text('For queries, contact: hr@moveinsync.com', 105, 286, { align: 'center' });
  doc.text(`Report ID: EMP-${report.employeeId}-${report.month}${report.year} | Generated: ${new Date().toLocaleString()}`, 105, 291, { align: 'center' });
  
  return doc;
};

// ============================================
// MAIN EXPORT FUNCTION
// ============================================
export const downloadReportPDF = (reportType, report, entityName = '') => {
  try {
    let doc;
    let fileName;
    
    switch (reportType) {
      case 'client':
        doc = generateClientReportPDF(report, entityName);
        fileName = `Client_Report_${report.clientId}_${report.month}_${report.year}.pdf`;
        break;
      case 'vendor':
        doc = generateVendorReportPDF(report);
        fileName = `Vendor_Report_${report.vendorId}_${report.month}_${report.year}.pdf`;
        break;
      case 'employee':
        doc = generateEmployeeReportPDF(report);
        fileName = `Employee_Incentive_${report.employeeId}_${report.month}_${report.year}.pdf`;
        break;
      default:
        throw new Error('Invalid report type');
    }
    
    doc.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    return false;
  }
};
