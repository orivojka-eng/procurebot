/**
 * ProcureBot Operations & Finance Automation Dataset
 * Comprehensive financial AP dataset, 3-way matching records, and ROI models.
 */

export const procureData = {
  platform: {
    name: "ProcureBot",
    subtitle: "Autonomous Invoice Parsing & 3-Way Ledger Reconciliation",
    enterpriseAttribution: "Built by QuolyTech for Enterprise Finance & Operations",
    copyright: "© 2026 QuolyTech. All rights reserved.",
    version: "v4.8.2-Enterprise-LTS",
    erpSyncStatus: "SAP S/4HANA & NetSuite Live Sync Active"
  },

  // High-Level Operations & AP Financial Telemetry
  metrics: {
    totalInvoicesQuarter: 8420,
    totalAmountReconciled: 14842500.00,
    straightThroughRate: 94.2, // % of invoices processed without human touch
    avgCycleTimeSeconds: 28,  // seconds per invoice (vs 15.4 min manual)
    hoursSavedQuarter: 1940,
    annualCostSavings: 264800.00,
    ocrPrecisionRate: 99.82,
    reconciledTodayCount: 142,
    exceptionsPendingCount: 4,
    duplicatePreventedSavings: 86450.00
  },

  // Financial ROI Calculator Defaults
  roiDefaults: {
    monthlyInvoiceVolume: 2500,
    clerkHourlyCost: 45.00,
    manualMinutesPerInvoice: 15,
    procurebotSecondsPerInvoice: 30,
    duplicateErrorRate: 2.8, // %
    avgInvoiceValue: 1850.00
  },

  // AP Aging Schedule ($ Millions)
  apAging: [
    { bucket: "Current (0-30 Days)", amount: 8420000, percentage: 68, color: "#10B981" },
    { bucket: "31-60 Days", amount: 2450000, percentage: 20, color: "#06B6D4" },
    { bucket: "61-90 Days", amount: 1120000, percentage: 9, color: "#F59E0B" },
    { bucket: "90+ Days (Overdue)", amount: 375000, percentage: 3, color: "#EF4444" }
  ],

  // Monthly Processing Volume & STP Rate Trend (Past 6 Months)
  monthlyTrends: [
    { month: "Apr 2026", total: 1120, automated: 985, stp: 88.0 },
    { month: "May 2026", total: 1240, automated: 1116, stp: 90.0 },
    { month: "Jun 2026", total: 1380, automated: 1262, stp: 91.5 },
    { month: "Jul 2026", total: 1450, automated: 1348, stp: 93.0 },
    { month: "Aug 2026", total: 1590, automated: 1494, stp: 94.0 },
    { month: "Sep 2026", total: 1640, automated: 1545, stp: 94.2 }
  ],

  // Vendor Spend Distribution
  vendorCategories: [
    { name: "Cloud Infrastructure", share: 43, amount: 6382000, color: "#06B6D4" },
    { name: "Hardware & Compute", share: 26, amount: 3859000, color: "#6366F1" },
    { name: "Logistics & Freight", share: 15, amount: 2226000, color: "#10B981" },
    { name: "Facilities & Operations", share: 9, amount: 1335000, color: "#F59E0B" },
    { name: "Professional Services", share: 7, amount: 1040500, color: "#EC4899" }
  ],

  // Invoices Queue (3-Way Matching Dataset)
  invoices: [
    {
      id: "INV-2026-8801",
      vendor: "Datadog, Inc.",
      vendorTaxId: "45-2984102",
      vendorLogo: "DD",
      vendorLogoColor: "#6366F1",
      invoiceNumber: "DD-948102-US",
      invoiceDate: "Sep 26, 2026",
      dueDate: "Oct 26, 2026 (Net 30)",
      totalAmount: 14250.00,
      currency: "USD",
      poNumber: "PO-8841",
      poAmount: 14250.00,
      receiptNumber: "GR-1049",
      receiptAmount: 14250.00,
      varianceAmount: 0.00,
      variancePercent: 0.00,
      status: "Reconciled",
      statusClass: "badge-reconciled",
      ocrConfidence: 99.9,
      glCode: "GL-6200 Cloud Telemetry & APM",
      erpSyncTarget: "SAP S/4HANA",
      lineItems: [
        { desc: "Datadog Infrastructure Pro - Host Units (Annual)", qty: 500, unitPrice: 23.00, total: 11500.00 },
        { desc: "Application Performance Monitoring (APM) APU Pack", qty: 10, unitPrice: 275.00, total: 2750.00 }
      ],
      auditNotes: "Flawless 3-Way Match. PO #PO-8841, Goods Receipt #GR-1049 and vendor invoice align to the penny ($0.00 variance)."
    },
    {
      id: "INV-2026-8802",
      vendor: "Snowflake Computing, Inc.",
      vendorTaxId: "81-1920481",
      vendorLogo: "SF",
      vendorLogoColor: "#06B6D4",
      invoiceNumber: "SNOW-2026-4011",
      invoiceDate: "Sep 25, 2026",
      dueDate: "Oct 25, 2026",
      totalAmount: 28400.00,
      currency: "USD",
      poNumber: "PO-8820",
      poAmount: 28400.00,
      receiptNumber: "GR-1033",
      receiptAmount: 28400.00,
      varianceAmount: 0.00,
      variancePercent: 0.00,
      status: "Reconciled",
      statusClass: "badge-reconciled",
      ocrConfidence: 99.8,
      glCode: "GL-6210 Enterprise Data Warehouse",
      erpSyncTarget: "Oracle NetSuite",
      lineItems: [
        { desc: "Snowflake Enterprise Warehouse Compute Capacity Units (CCU)", qty: 9500, unitPrice: 2.80, total: 26600.00 },
        { desc: "Encrypted Cloud Storage Tier (TB/Month)", qty: 75, unitPrice: 24.00, total: 1800.00 }
      ],
      auditNotes: "Automated Straight-Through Processing (STP) executed. NetSuite Journal Entry #JE-9042 created."
    },
    {
      id: "INV-2026-8803",
      vendor: "Dell Technologies",
      vendorTaxId: "74-2615809",
      vendorLogo: "DL",
      vendorLogoColor: "#0284C7",
      invoiceNumber: "DELL-INV-80219",
      invoiceDate: "Sep 27, 2026",
      dueDate: "Oct 12, 2026",
      totalAmount: 42650.00,
      currency: "USD",
      poNumber: "PO-8815",
      poAmount: 39900.00,
      receiptNumber: "GR-1020",
      receiptAmount: 39900.00,
      varianceAmount: 2750.00,
      variancePercent: 6.89,
      status: "Variance Flagged",
      statusClass: "badge-variance",
      ocrConfidence: 99.4,
      glCode: "GL-1500 Capitalized Server Equipment",
      erpSyncTarget: "SAP S/4HANA",
      lineItems: [
        { desc: "PowerEdge R760 2U Rack Server Dual Intel Xeon", qty: 3, unitPrice: 11500.00, total: 34500.00 },
        { desc: "64GB DDR5-4800MHz ECC Registered RDIMM (Contract: $350)", qty: 15, unitPrice: 410.00, total: 6150.00 },
        { desc: "Dell ProSupport Plus 24x7 3-Year Onsite Warranty", qty: 3, unitPrice: 666.67, total: 2000.00 }
      ],
      auditNotes: "DISCREPANCY: Unit price for 64GB DDR5 memory billed at $410.00 vs approved PO rate of $350.00. Total variance +$2,750.00."
    },
    {
      id: "INV-2026-8804",
      vendor: "FedEx Freight & Logistics",
      vendorTaxId: "62-1721890",
      vendorLogo: "FX",
      vendorLogoColor: "#EA580C",
      invoiceNumber: "FDX-90142-USA",
      invoiceDate: "Sep 28, 2026",
      dueDate: "Oct 28, 2026",
      totalAmount: 3420.50,
      currency: "USD",
      poNumber: "PO-8799",
      poAmount: 3420.50,
      receiptNumber: "GR-1011",
      receiptAmount: 3420.50,
      varianceAmount: 0.00,
      variancePercent: 0.00,
      status: "Duplicate Warning",
      statusClass: "badge-duplicate",
      ocrConfidence: 99.7,
      glCode: "GL-6500 Corporate Freight & Shipping",
      erpSyncTarget: "QuickBooks Enterprise",
      lineItems: [
        { desc: "Cross-Country Dedicated LTL Expedited Freight", qty: 2, unitPrice: 1510.25, total: 3020.50 },
        { desc: "Fuel Surcharge & Liftgate Service", qty: 1, unitPrice: 400.00, total: 400.00 }
      ],
      auditNotes: "FRAUD / DUPLICATE PREVENTION: Invoice #FDX-90142-USA was already paid on Sep 24, 2026 (Ref Check #9811). Payment blocked."
    },
    {
      id: "INV-2026-8805",
      vendor: "Cisco Systems Enterprise",
      vendorTaxId: "94-2901844",
      vendorLogo: "CS",
      vendorLogoColor: "#059669",
      invoiceNumber: "CSCO-US-77192",
      invoiceDate: "Sep 28, 2026",
      dueDate: "Nov 12, 2026 (Net 45)",
      totalAmount: 18900.00,
      currency: "USD",
      poNumber: "PO-8804",
      poAmount: 18900.00,
      receiptNumber: "GR-1018",
      receiptAmount: 18900.00,
      varianceAmount: 0.00,
      variancePercent: 0.00,
      status: "Pending Review",
      statusClass: "badge-pending",
      ocrConfidence: 99.2,
      glCode: "GL-1520 Campus Networking Hardware",
      erpSyncTarget: "Workday Financials",
      lineItems: [
        { desc: "Catalyst 9300 48-Port PoE+ Layer 3 Switch", qty: 2, unitPrice: 7200.00, total: 14400.00 },
        { desc: "Cisco DNA Premier 5-Year Subscription License", qty: 2, unitPrice: 2250.00, total: 4500.00 }
      ],
      auditNotes: "Awaiting CFO Level-2 authorization for hardware spend exceeding $15,000 threshold."
    }
  ],

  // Live OCR Simulation Presets for Demo
  scanPresets: [
    {
      id: "preset-clean",
      name: "Datadog Cloud (Flawless 3-Way Match)",
      vendor: "Datadog, Inc.",
      amount: "$14,250.00",
      po: "PO-8841",
      expectedOutcome: "Auto-Reconciled (0.00% Variance)",
      durationMs: 2200
    },
    {
      id: "preset-variance",
      name: "Dell Hardware (Price Discrepancy Flag)",
      vendor: "Dell Technologies",
      amount: "$42,650.00",
      po: "PO-8815",
      expectedOutcome: "Flagged: +$2,750.00 Price Mismatch",
      durationMs: 2500
    },
    {
      id: "preset-duplicate",
      name: "FedEx Freight (Duplicate Invoice Detection)",
      vendor: "FedEx Freight",
      amount: "$3,420.50",
      po: "PO-8799",
      expectedOutcome: "Blocked: Identical Invoice Exists in Ledger",
      durationMs: 2000
    }
  ]
};
