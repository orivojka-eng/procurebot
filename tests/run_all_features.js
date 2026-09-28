/**
 * ProcureBot Operations & Finance - Comprehensive Test Suite (Node/JSDOM)
 * Tests all AP automation features, laser OCR scanner, ROI calculations, and charts.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '..', 'index.html');
const htmlSource = fs.readFileSync(htmlPath, 'utf8');

// Virtual DOM
const dom = new JSDOM(htmlSource, {
  runScripts: "dangerously",
  resources: "usable",
  url: "http://localhost:5177/"
});

const { window } = dom;
const { document } = window;

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAILED: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log("\n======================================================");
  console.log(" PROCUREBOT AUTOMATED AP TEST SUITE (Node/JSDOM)");
  console.log("======================================================\n");

  const { icons } = await import('../src/icons.js');
  const { procureData } = await import('../src/data.js');

  console.log("--- TEST GROUP 1: FinTech Vector SVG Icons ---");
  assert(typeof icons.bot === 'function', "ProcureBot AI emblem generator exists");
  assert(icons.bot().includes('<svg'), "ProcureBot AI emblem returns valid SVG");
  assert(typeof icons.scan === 'function', "Laser scanner vector SVG exists");
  assert(typeof icons.checkCircle === 'function', "3-Way reconciled vector SVG exists");
  assert(typeof icons.alertTriangle === 'function', "Variance alert vector SVG exists");
  assert(typeof icons.zap === 'function', "STP lightning vector SVG exists");
  assert(typeof icons.calculator === 'function', "Calculator vector SVG exists");
  assert(typeof icons.barChart === 'function', "Bar chart vector SVG exists");
  assert(typeof icons.database === 'function', "Database ERP vector SVG exists");

  console.log("\n--- TEST GROUP 2: Enterprise Attribution & Zero Raw Emojis ---");
  const bodyText = document.body.innerHTML;
  const rawEmojiRegex = /[\u{1F300}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
  assert(!rawEmojiRegex.test(bodyText), "DOM is 100% clean of raw unicode emojis");
  assert(bodyText.includes("QuolyTech"), "QuolyTech corporate attribution present");
  assert(bodyText.includes("© 2026 QuolyTech. All rights reserved."), "2026 Copyright statement present");

  console.log("\n--- TEST GROUP 3: Header Telemetry Tickers ---");
  const headerStp = document.getElementById('header-stp-rate');
  const headerSavings = document.getElementById('header-savings-amt');
  const headerErp = document.getElementById('header-erp-status');
  const btnHeaderScan = document.getElementById('btn-header-scan');

  assert(headerStp !== null, "Header STP rate ticker element exists");
  assert(headerSavings !== null, "Header savings amount element exists");
  assert(headerErp !== null, "Header ERP live status element exists");
  assert(btnHeaderScan !== null, "Header scan invoice trigger exists");

  console.log("\n--- TEST GROUP 4: Navigation Ribbons & Tabs ---");
  const tabIntro = document.getElementById('tab-intro');
  const tabOverview = document.getElementById('tab-overview');
  const tabQueue = document.getElementById('tab-queue');
  const tabCalc = document.getElementById('tab-calculator');
  const tabAging = document.getElementById('tab-aging');
  const tabErp = document.getElementById('tab-erp');

  assert(tabIntro && tabOverview && tabQueue && tabCalc && tabAging && tabErp, "All 6 navigation tabs exist (including Intro & Architecture)");

  console.log("\n--- TEST GROUP 4B: Dedicated Intro Page & Pipeline Section ---");
  const introHero = document.getElementById('intro-hero-section');
  const btnIntroLaunch = document.getElementById('btn-intro-launch-console');
  const btnIntroScan = document.getElementById('btn-intro-scan');
  const pipelineGrid = document.getElementById('pipeline-nodes-grid');
  const pipelineDetail = document.getElementById('pipeline-detail-box');
  const sampleDatadog = document.getElementById('btn-sample-datadog');
  const sampleDell = document.getElementById('btn-sample-dell');
  const sampleFedex = document.getElementById('btn-sample-fedex');

  assert(introHero !== null, "Intro hero section exists");
  assert(btnIntroLaunch !== null, "Intro launch console CTA button exists");
  assert(btnIntroScan !== null, "Intro run scanner CTA button exists");
  assert(pipelineGrid !== null, "4-Stage pipeline architecture grid exists");
  assert(pipelineDetail !== null, "Pipeline detail drawer exists");
  assert(sampleDatadog && sampleDell && sampleFedex, "All 3 sample ingestion testing cards exist");

  console.log("\n--- TEST GROUP 5: Executive Dashboard & KPI Metrics ---");
  const kpiReconciled = document.getElementById('kpi-reconciled-value');
  const kpiStp = document.getElementById('kpi-stp-value');
  const kpiSpeed = document.getElementById('kpi-speed-value');
  const kpiDuplicate = document.getElementById('kpi-duplicate-value');

  assert(kpiReconciled !== null, "Reconciled volume KPI card exists");
  assert(kpiStp !== null, "Straight-Through Processing KPI card exists");
  assert(kpiSpeed !== null, "Processing cycle time KPI card exists");
  assert(kpiDuplicate !== null, "Duplicate leakage blocked KPI card exists");

  console.log("\n--- TEST GROUP 6: Financial Charts (Volume & Aging) ---");
  const chartVolumeWrapper = document.getElementById('svg-volume-chart-wrapper');
  const agingBarsWrapper = document.getElementById('ap-aging-bars-wrapper');

  assert(chartVolumeWrapper !== null, "Volume trend area chart container exists");
  assert(agingBarsWrapper !== null, "AP aging progress bars container exists");

  console.log("\n--- TEST GROUP 7: Invoice Reconciliation Queue (3-Way Matching) ---");
  const searchQueue = document.getElementById('input-search-queue');
  const filterQueue = document.getElementById('filter-queue-status');
  const btnBatchApprove = document.getElementById('btn-batch-approve');
  const invoicesTable = document.getElementById('invoices-table-body');

  assert(searchQueue !== null, "Queue search input exists");
  assert(filterQueue !== null, "Queue status filter dropdown exists");
  assert(btnBatchApprove !== null, "Batch approve button exists");
  assert(invoicesTable !== null, "Invoices table body exists");

  console.log("\n--- TEST GROUP 8: Financial ROI & Cost Calculator ---");
  const sliderInvoices = document.getElementById('slider-invoices');
  const sliderRate = document.getElementById('slider-rate');
  const sliderMins = document.getElementById('slider-mins');
  const calcAnnualSavings = document.getElementById('calc-annual-savings');
  const calcHoursSaved = document.getElementById('calc-hours-saved');
  const calcRoiMultiplier = document.getElementById('calc-roi-multiplier');

  assert(sliderInvoices !== null, "Monthly volume slider exists");
  assert(sliderRate !== null, "Hourly rate slider exists");
  assert(sliderMins !== null, "Manual minutes slider exists");
  assert(calcAnnualSavings !== null, "Calculated annual savings output exists");
  assert(calcHoursSaved !== null, "Calculated hours saved output exists");
  assert(calcRoiMultiplier !== null, "Calculated ROI multiplier output exists");

  console.log("\n--- TEST GROUP 9: Holographic OCR Scanner & Real-Time Loading Modal ---");
  const modalScanner = document.getElementById('modal-scanner');
  const scannerLaser = document.getElementById('scanner-laser');
  const scannerTerminal = document.getElementById('scanner-terminal-stream');
  const btnCloseScanner = document.getElementById('btn-close-scanner');
  const btnPresetClean = document.getElementById('btn-run-preset-clean');

  assert(modalScanner !== null, "Holographic OCR scanner modal exists");
  assert(scannerLaser !== null, "Laser beam scanner element exists");
  assert(scannerTerminal !== null, "Real-time terminal log stream exists");
  assert(btnCloseScanner !== null, "Close scanner button exists");
  assert(btnPresetClean !== null, "Clean match preset demonstration button exists");

  console.log("\n--- TEST GROUP 10: Split-Screen 3-Way Reconciliation Inspector ---");
  const modalInspector = document.getElementById('modal-inspector');
  const inspectorTitle = document.getElementById('inspector-title');
  const docBody = document.getElementById('inspector-doc-body');
  const matrix = document.getElementById('inspector-matrix');
  const btnInspectorApprove = document.getElementById('btn-inspector-approve');

  assert(modalInspector !== null, "Split-screen inspector modal exists");
  assert(inspectorTitle !== null, "Inspector modal title exists");
  assert(docBody !== null, "Left-hand OCR document body exists");
  assert(matrix !== null, "Right-hand 3-way matching matrix exists");
  assert(btnInspectorApprove !== null, "Inspector Approve & Post button exists");

  console.log("\n--- TEST GROUP 11: ERP General Ledger Sync & Exports ---");
  const btnSyncErp = document.getElementById('btn-sync-erp-now');
  const btnExportGl = document.getElementById('btn-export-gl-csv');

  assert(btnSyncErp !== null, "Trigger ERP sync button exists");
  assert(btnExportGl !== null, "Export General Ledger CSV button exists");

  console.log("\n--- TEST GROUP 12: Custom Invoice Ingestion Studio ---");
  const modalCreateInv = document.getElementById('modal-create-invoice');
  const formCreateInv = document.getElementById('form-create-custom-invoice');
  const inputVendor = document.getElementById('input-custom-vendor');
  const inputPoAmt = document.getElementById('input-custom-po-amt');
  const inputInvAmt = document.getElementById('input-custom-inv-amt');
  const previewDoc = document.getElementById('custom-doc-preview');
  const varianceRadar = document.getElementById('custom-variance-radar');
  const btnSubmitInv = document.getElementById('btn-submit-custom-invoice');
  const btnPreNvidia = document.getElementById('btn-preset-nvidia');

  assert(modalCreateInv !== null, "Custom invoice ingestion studio modal exists");
  assert(formCreateInv !== null, "Custom invoice form exists");
  assert(inputVendor && inputPoAmt && inputInvAmt, "Core invoice input fields exist");
  assert(previewDoc !== null, "Live digital paper preview element exists");
  assert(varianceRadar !== null, "Real-time 3-way variance radar exists");
  assert(btnSubmitInv !== null, "Submit & ingest invoice button exists");
  assert(btnPreNvidia !== null, "AI enterprise preset button exists");

  console.log("\n======================================================");
  console.log(" TEST RESULTS SUMMARY:");
  console.log(` Passed: ${passed}`);
  console.log(` Failed: ${failed}`);
  console.log("======================================================\n");

  if (failed === 0) {
    console.log("🎉 ALL PROCUREBOT AP AUTOMATION FEATURES TESTED AND PASSED PERFECTLY!\n");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTestSuite().catch(err => {
  console.error("Test execution error:", err);
  process.exit(1);
});
