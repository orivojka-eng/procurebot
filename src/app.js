/**
 * ProcureBot Operations & Finance Automation System
 * High-precision AP automation engine with OCR laser scanning,
 * 3-way matching matrix, live SVG charts, and interactive ROI calculator.
 */

import { icons } from './icons.js';
import { procureData } from './data.js';

class ProcureBotApp {
  constructor() {
    this.data = JSON.parse(JSON.stringify(procureData));
    this.currentView = 'view-intro';
    this.scanInterval = null;
    this.activeInspectorInvoice = null;
    // Studio state
    this.studioLineItems = [
      { id: 1, desc: '8x NVIDIA H100 SXM5 80GB GPU Supercomputing Nodes', qty: 8, price: 23125 }
    ];
    this.studioScenario = 'clean'; // 'clean' | 'variance' | 'duplicate'
  }

  init() {
    this.renderIcons();
    this.bindEvents();
    this.renderVolumeChart();
    this.renderAgingBars();
    this.renderSpendDonut();
    this.renderInvoicesQueue();
    this.updateRoiCalculations();
  }

  renderIcons() {
    // Header & Emblem
    this.setInner('brand-emblem-icon', icons.bot(24));
    this.setInner('icon-header-scan', icons.scan(18));

    // Nav Tabs
    this.setInner('icon-tab-intro', icons.bot(18));
    this.setInner('icon-tab-overview', icons.barChart(18));
    this.setInner('icon-tab-queue', icons.fileText(18));
    this.setInner('icon-tab-calculator', icons.calculator(18));
    this.setInner('icon-tab-aging', icons.pieChart(18));
    this.setInner('icon-tab-erp', icons.database(18));

    // Intro Page Icons
    this.setInner('icon-intro-btn-scan', icons.scan(18));
    this.setInner('icon-upload-invoice', icons.fileText(16));
    this.setInner('icon-badge-soc1', icons.shieldCheck(18));
    this.setInner('icon-badge-soc2', icons.shieldCheck(18));
    this.setInner('icon-badge-iso', icons.shieldCheck(18));
    this.setInner('icon-badge-sap', icons.shieldCheck(18));
    this.setInner('icon-badge-netsuite', icons.shieldCheck(18));

    // KPI Cards
    this.setInner('icon-kpi-reconciled', icons.dollar(24));
    this.setInner('icon-kpi-stp', icons.zap(24));
    this.setInner('icon-kpi-speed', icons.clock(24));
    this.setInner('icon-kpi-duplicate', icons.copy(24));

    // Queue & Controls
    this.setInner('icon-search-queue', icons.search(18));
    this.setInner('icon-batch-check', icons.checkCircle(18));
    this.setInner('icon-queue-scan', icons.scan(18));
    this.setInner('icon-calc-export', icons.download(18));
    this.setInner('icon-erp-refresh', icons.refresh(18));
    this.setInner('icon-erp-download', icons.download(18));

    // Modals
    this.setInner('icon-modal-scan-title', icons.scan(22));
    this.setInner('icon-close-scanner', icons.close(22));
    this.setInner('icon-close-inspector', icons.close(22));

    // Custom Ingestion Studio Icons
    this.setInner('icon-header-plus', icons.plus(16));
    this.setInner('icon-intro-plus', icons.plus(16));
    this.setInner('icon-queue-plus', icons.plus(16));
    this.setInner('icon-queue-batch', icons.layers(16));
    this.setInner('icon-create-modal-sparkle', icons.sparkles(22));
    this.setInner('icon-close-create-modal', icons.close(22));
    this.setInner('icon-submit-custom-sparkle', icons.zap(18));
    // Studio tab & buttons
    this.setInner('icon-tab-studio', icons.sparkles(18));
    this.setInner('icon-studio-dice', icons.dice(16));
    this.setInner('icon-studio-batch', icons.layers(16));
    this.setInner('icon-studio-add-line', icons.plus(14));
    this.setInner('icon-studio-submit-laser', icons.scan(18));
    this.setInner('icon-scenario-clean', icons.checkCircle(14));
    this.setInner('icon-scenario-variance', icons.alertTriangle(14));
    this.setInner('icon-scenario-duplicate', icons.copy(14));
  }

  setInner(id, html) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  }

  bindEvents() {
    // Nav Tab Switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const viewId = tab.dataset.view;
        this.switchView(viewId);
      });
    });

    // Scanner Triggers
    const btnHeaderScan = document.getElementById('btn-header-scan');
    const btnQueueScan = document.getElementById('btn-queue-scan-new');
    const btnBannerScan = document.getElementById('btn-banner-scan-demo');
    const btnCloseScanner = document.getElementById('btn-close-scanner');

    [btnHeaderScan, btnQueueScan, btnBannerScan].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          this.openOcrScanner('preset-clean');
        });
      }
    });

    if (btnCloseScanner) {
      btnCloseScanner.addEventListener('click', () => {
        this.closeOcrScanner();
      });
    }

    // Scanner Demo Presets
    const btnClean = document.getElementById('btn-run-preset-clean');
    const btnVariance = document.getElementById('btn-run-preset-variance');
    const btnDuplicate = document.getElementById('btn-run-preset-duplicate');

    if (btnClean) btnClean.addEventListener('click', () => this.runScannerScenario('preset-clean'));
    if (btnVariance) btnVariance.addEventListener('click', () => this.runScannerScenario('preset-variance'));
    if (btnDuplicate) btnDuplicate.addEventListener('click', () => this.runScannerScenario('preset-duplicate'));

    // Inspector Modal Close
    const btnCloseInspector = document.getElementById('btn-close-inspector');
    if (btnCloseInspector) {
      btnCloseInspector.addEventListener('click', () => {
        const modal = document.getElementById('modal-inspector');
        if (modal) modal.style.display = 'none';
      });
    }

    // Inspector Action Buttons
    const btnApprove = document.getElementById('btn-inspector-approve');
    const btnOverride = document.getElementById('btn-inspector-override');
    const btnReject = document.getElementById('btn-inspector-reject');

    if (btnApprove) btnApprove.addEventListener('click', () => this.handleInspectorApprove());
    if (btnOverride) btnOverride.addEventListener('click', () => this.handleInspectorOverride());
    if (btnReject) btnReject.addEventListener('click', () => this.handleInspectorReject());

    // Batch Approve
    const btnBatch = document.getElementById('btn-batch-approve');
    if (btnBatch) {
      btnBatch.addEventListener('click', () => this.handleBatchApprove());
    }

    // Queue Search & Filters
    const inputSearch = document.getElementById('input-search-queue');
    const filterStatus = document.getElementById('filter-queue-status');

    if (inputSearch) inputSearch.addEventListener('input', () => this.filterQueue());
    if (filterStatus) filterStatus.addEventListener('change', () => this.filterQueue());

    // ROI Calculator Sliders
    const sliderInvoices = document.getElementById('slider-invoices');
    const sliderRate = document.getElementById('slider-rate');
    const sliderMins = document.getElementById('slider-mins');

    [sliderInvoices, sliderRate, sliderMins].forEach(slider => {
      if (slider) {
        slider.addEventListener('input', () => this.updateRoiCalculations());
      }
    });

    // ROI Export
    const btnExportRoi = document.getElementById('btn-export-roi-summary');
    if (btnExportRoi) {
      btnExportRoi.addEventListener('click', () => {
        window.print();
      });
    }

    // ERP Sync Buttons
    const btnSyncErp = document.getElementById('btn-sync-erp-now');
    const btnExportGl = document.getElementById('btn-export-gl-csv');

    if (btnSyncErp) btnSyncErp.addEventListener('click', () => this.triggerErpSync());
    if (btnExportGl) btnExportGl.addEventListener('click', () => this.exportGlCsv());

    // Intro Page CTAs
    const btnIntroConsole = document.getElementById('btn-intro-launch-console');
    const btnIntroScan = document.getElementById('btn-intro-scan');
    const btnIntroCalc = document.getElementById('btn-intro-calc');

    if (btnIntroConsole) btnIntroConsole.addEventListener('click', () => this.switchView('view-overview'));
    if (btnIntroScan) btnIntroScan.addEventListener('click', () => this.openOcrScanner('preset-clean'));
    if (btnIntroCalc) btnIntroCalc.addEventListener('click', () => this.switchView('view-calculator'));

    // Pipeline Cards Click Interaction
    const pipelineData = {
      1: {
        title: "Stage 01: Omnichannel Ingestion Pipeline",
        status: "Telemetry Active",
        text: "Continuous background workers poll dedicated AP email queues (ap-invoices@company.com), sFTP servers, and REST APIs. Ingested files are validated against cryptographic SHA-256 hashes to guarantee zero duplicate submissions."
      },
      2: {
        title: "Stage 02: Neural OCR & Entity Extraction",
        status: "99.82% Confidence",
        text: "Layout-aware transformer models segment the document into bounding boxes, identifying Vendor Legal Name, Tax ID, PO references, line item unit prices, quantities, and net totals with 99.82% optical accuracy."
      },
      3: {
        title: "Stage 03: 3-Way Match Verification Engine",
        status: "0% Variance Tolerance",
        text: "The engine queries the enterprise ERP database in real-time, executing strict 3-way reconciliation (Vendor Invoice ⇄ Purchase Order ⇄ Goods Receipt). Automatically flags unit-price discrepancies or unreceived line items."
      },
      4: {
        title: "Stage 04: Autonomous General Ledger Posting",
        status: "Auto-Balanced",
        text: "Reconciled invoices trigger automatic journal entry generation with pre-configured GL cost centers (e.g. GL-6200 Cloud, GL-1500 CapEx) directly in SAP S/4HANA, NetSuite, Workday, or QuickBooks."
      }
    };

    [1, 2, 3, 4].forEach(step => {
      const card = document.getElementById(`pipe-card-${step}`);
      if (card) {
        card.addEventListener('click', () => {
          [1, 2, 3, 4].forEach(s => {
            const c = document.getElementById(`pipe-card-${s}`);
            if (c) c.classList.toggle('active', s === step);
          });
          const detailTitle = document.getElementById('pipe-detail-title');
          const detailStatus = document.getElementById('pipe-detail-status');
          const detailText = document.getElementById('pipe-detail-text');
          const info = pipelineData[step];
          if (detailTitle) detailTitle.textContent = info.title;
          if (detailStatus) detailStatus.textContent = info.status;
          if (detailText) detailText.textContent = info.text;
        });
      }
    });

    // Intro Sample Ingestion Cards
    const btnSampleDatadog = document.getElementById('btn-sample-datadog');
    const btnSampleDell = document.getElementById('btn-sample-dell');
    const btnSampleFedex = document.getElementById('btn-sample-fedex');

    if (btnSampleDatadog) btnSampleDatadog.addEventListener('click', () => this.openOcrScanner('preset-clean'));
    if (btnSampleDell) btnSampleDell.addEventListener('click', () => this.openOcrScanner('preset-variance'));
    if (btnSampleFedex) btnSampleFedex.addEventListener('click', () => this.openOcrScanner('preset-duplicate'));

    // Custom Mock File Upload
    const inputFile = document.getElementById('input-custom-invoice');
    if (inputFile) {
      inputFile.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const customName = file.name.replace(/\.[^/.]+$/, "");
          const newInvId = `INV-2026-90${this.data.invoices.length + 1}`;
          const newEntry = {
            id: newInvId,
            vendor: customName,
            vendorTaxId: "99-5544332",
            vendorLogo: customName.slice(0, 2).toUpperCase(),
            vendorLogoColor: "#10B981",
            invoiceNumber: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
            invoiceDate: "Today",
            dueDate: "Net 30",
            totalAmount: 8950.00,
            currency: "USD",
            poNumber: "PO-8850",
            poAmount: 8950.00,
            receiptNumber: "GR-1055",
            receiptAmount: 8950.00,
            varianceAmount: 0.00,
            variancePercent: 0.00,
            status: "Reconciled",
            statusClass: "badge-reconciled",
            ocrConfidence: 99.8,
            glCode: "GL-6400 General Operations",
            erpSyncTarget: "SAP S/4HANA",
            lineItems: [{ desc: `${file.name} - Ingested Services`, qty: 1, unitPrice: 8950.00, total: 8950.00 }],
            auditNotes: `Document ${file.name} successfully parsed via neural OCR buffer. 100% matched to PO #PO-8850.`
          };

          this.data.invoices.unshift(newEntry);
          this.renderInvoicesQueue();
          this.openOcrScanner('preset-clean');
        }
      });
    }

    // Custom Invoice Modal Triggers
    const btnHeaderCustom = document.getElementById('btn-header-custom-inv');
    const btnIntroCustom = document.getElementById('btn-intro-custom-inv');
    const btnQueueCustom = document.getElementById('btn-queue-custom-inv');
    const modalCreate = document.getElementById('modal-create-invoice');
    const btnCloseCreate = document.getElementById('btn-close-create-modal');

    [btnHeaderCustom, btnIntroCustom, btnQueueCustom].forEach(btn => {
      if (btn) {
        btn.addEventListener('click', () => {
          if (modalCreate) modalCreate.style.display = 'flex';
          this.updateCustomInvoicePreview();
        });
      }
    });

    if (btnCloseCreate && modalCreate) {
      btnCloseCreate.addEventListener('click', () => {
        modalCreate.style.display = 'none';
      });
    }

    // Presets in Custom Invoice Modal
    const btnPreNvidia = document.getElementById('btn-preset-nvidia');
    const btnPreOpenai = document.getElementById('btn-preset-openai');
    const btnPreAws = document.getElementById('btn-preset-aws');

    if (btnPreNvidia) {
      btnPreNvidia.addEventListener('click', () => {
        this.fillCustomInvoiceForm("NVIDIA Corporation", "94-3177749", "NV-2026-9041", "PO-8890", 185000, "GR-1080", 185000, "8x NVIDIA H100 SXM5 80GB GPU Supercomputing Nodes", 8, 23125, "GL-1500 Capitalized AI & Server Hardware", "SAP S/4HANA");
      });
    }

    if (btnPreOpenai) {
      btnPreOpenai.addEventListener('click', () => {
        this.fillCustomInvoiceForm("OpenAI Enterprise", "88-2940192", "OAI-2026-4401", "PO-8888", 24500, "GR-1075", 24500, "Enterprise GPT-4o API Production Compute Tokens", 50, 490, "GL-6200 Cloud Telemetry & Observability", "Oracle NetSuite");
      });
    }

    if (btnPreAws) {
      btnPreAws.addEventListener('click', () => {
        this.fillCustomInvoiceForm("Amazon Web Services", "47-0810291", "AWS-INV-772910", "PO-8875", 34000, "GR-1070", 36200, "AWS Cloud EC2 UltraClusters & S3 Standard Storage", 1, 36200, "GL-6200 Cloud Telemetry & Observability", "SAP S/4HANA");
      });
    }

    // Live form inputs listener
    const formCustom = document.getElementById('form-create-custom-invoice');
    if (formCustom) {
      formCustom.addEventListener('input', () => this.updateCustomInvoicePreview());
      formCustom.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleCustomInvoiceSubmit();
      });
    }

    // Banner Shortcut to Calc
    const btnBannerCalc = document.getElementById('btn-banner-open-calc');
    if (btnBannerCalc) {
      btnBannerCalc.addEventListener('click', () => this.switchView('view-calculator'));
    }

    // Queue quick batch-5 generator
    const btnQueueBatch5 = document.getElementById('btn-queue-batch-5');
    if (btnQueueBatch5) {
      btnQueueBatch5.addEventListener('click', () => this.generateBatch5());
    }

    // ---- CUSTOM INGESTION STUDIO ----
    // Open studio tab via "+ Ingest Custom" buttons (redirect to view-studio instead of modal)
    const btnQueueCustom2 = document.getElementById('btn-queue-custom-inv');
    if (btnQueueCustom2) {
      btnQueueCustom2.addEventListener('click', () => this.switchView('view-studio'));
    }

    // Persona chip buttons
    const personas = {
      'chip-persona-nvidia':   ['NVIDIA Corporation',    '94-3177749', 'NV-2026-9041',    'PO-8890', 185000,  'GR-1080', 'SAP S/4HANA',          'GL-1500 Capitalized AI & Server Hardware', [
        { id: 1, desc: '8x NVIDIA H100 SXM5 80GB GPU Supercomputing Nodes', qty: 8, price: 23125 }
      ], 'Net 30', 'clean'],
      'chip-persona-openai':   ['OpenAI Enterprise',    '88-2940192', 'OAI-2026-4401',   'PO-8888', 24500,   'GR-1075', 'Oracle NetSuite',       'GL-6200 Cloud Telemetry & Observability', [
        { id: 1, desc: 'Enterprise GPT-4o API Production Compute Tokens', qty: 50, price: 490 }
      ], 'Net 15', 'clean'],
      'chip-persona-aws':      ['Amazon Web Services',  '47-0810291', 'AWS-INV-772910',   'PO-8875', 34000,   'GR-1070', 'SAP S/4HANA',          'GL-6200 Cloud Telemetry & Observability', [
        { id: 1, desc: 'AWS Cloud EC2 UltraClusters & S3 Standard Storage', qty: 1, price: 36200 }
      ], 'Net 30', 'variance'],
      'chip-persona-tesla':    ['Tesla Energy Inc.',    '81-4490192', 'TSLA-INV-20265501', 'PO-8920', 94800,   'GR-1090', 'SAP S/4HANA',          'GL-1500 Capitalized AI & Server Hardware', [
        { id: 1, desc: 'Megapack 2XL Lithium Iron Phosphate Battery System', qty: 3, price: 31600 }
      ], 'Net 45', 'clean'],
      'chip-persona-apple':    ['Apple Inc. Enterprise','94-2404110', 'AAPL-ENT-2026-881', 'PO-8918', 52400,   'GR-1088', 'Oracle NetSuite',       'GL-6400 General IT & Software Operations', [
        { id: 1, desc: 'MacBook Pro 16" M4 Max Fleet (Business Lease)',      qty: 20, price: 2620 }
      ], 'Net 30', 'clean'],
      'chip-persona-starlink': ['Starlink Business LLC','98-1124490', 'STRL-2026-7721',   'PO-8905', 14500,   'GR-1082', 'Workday Financials',    'GL-6400 General IT & Software Operations', [
        { id: 1, desc: 'Starlink Business Priority Uplink 12-Month License', qty: 5, price: 2900 }
      ], 'Net 30', 'duplicate']
    };

    Object.entries(personas).forEach(([btnId, args]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          document.querySelectorAll('.persona-chip-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.loadStudioPersona(...args);
        });
      }
    });

    // Scenario mode buttons
    ['clean', 'variance', 'duplicate'].forEach(mode => {
      const btn = document.getElementById(`mode-scenario-${mode}`);
      if (btn) {
        btn.addEventListener('click', () => {
          this.setStudioScenario(mode);
        });
      }
    });

    // Randomise invoice
    const btnStudioRandom = document.getElementById('btn-studio-randomize');
    if (btnStudioRandom) btnStudioRandom.addEventListener('click', () => this.studioRandomize());

    // Batch-5 from studio
    const btnStudioBatch5 = document.getElementById('btn-studio-batch-5');
    if (btnStudioBatch5) btnStudioBatch5.addEventListener('click', () => this.generateBatch5());

    // Reset studio defaults
    const btnStudioReset = document.getElementById('btn-studio-reset');
    if (btnStudioReset) btnStudioReset.addEventListener('click', () => {
      document.querySelectorAll('.persona-chip-btn').forEach(b => b.classList.remove('active'));
      document.getElementById('chip-persona-nvidia')?.classList.add('active');
      this.loadStudioPersona('NVIDIA Corporation','94-3177749','NV-2026-9041','PO-8890',185000,'GR-1080','SAP S/4HANA','GL-1500 Capitalized AI & Server Hardware',[{id:1,desc:'8x NVIDIA H100 SXM5 80GB GPU Supercomputing Nodes',qty:8,price:23125}],'Net 30','clean');
    });

    // Add line item
    const btnAddLine = document.getElementById('btn-studio-add-line');
    if (btnAddLine) btnAddLine.addEventListener('click', () => this.studioAddLineItem());

    // Studio form live update
    const formStudio = document.getElementById('form-studio-create-invoice');
    if (formStudio) {
      formStudio.addEventListener('input', () => this.updateStudioPreview());
      formStudio.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleStudioSubmit();
      });
    }

    // Initial studio render
    this.renderStudioLineItems();
    this.updateStudioPreview();
  }

  fillCustomInvoiceForm(vendor, taxid, invnum, po, poAmt, gr, invAmt, desc, qty, price, gl, erp) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };
    setVal('input-custom-vendor', vendor);
    setVal('input-custom-taxid', taxid);
    setVal('input-custom-invnum', invnum);
    setVal('input-custom-po', po);
    setVal('input-custom-po-amt', poAmt);
    setVal('input-custom-gr', gr);
    setVal('input-custom-inv-amt', invAmt);
    setVal('input-custom-item-desc', desc);
    setVal('input-custom-item-qty', qty);
    setVal('input-custom-item-price', price);
    setVal('select-custom-gl', gl);
    setVal('select-custom-erp', erp);

    this.updateCustomInvoicePreview();
  }

  updateCustomInvoicePreview() {
    const vendor = document.getElementById('input-custom-vendor')?.value || 'Vendor Legal Name';
    const taxid = document.getElementById('input-custom-taxid')?.value || 'XX-XXXXXXX';
    const invnum = document.getElementById('input-custom-invnum')?.value || 'INV-000000';
    const po = document.getElementById('input-custom-po')?.value || 'PO-0000';
    const poAmt = parseFloat(document.getElementById('input-custom-po-amt')?.value || '0');
    const gr = document.getElementById('input-custom-gr')?.value || 'GR-0000';
    const invAmt = parseFloat(document.getElementById('input-custom-inv-amt')?.value || '0');
    const itemDesc = document.getElementById('input-custom-item-desc')?.value || 'Line item description';
    const itemQty = parseFloat(document.getElementById('input-custom-item-qty')?.value || '1');
    const itemPrice = parseFloat(document.getElementById('input-custom-item-price')?.value || '0');

    // Update digital paper preview
    const prevVendor = document.getElementById('preview-vendor');
    const prevTaxid = document.getElementById('preview-taxid');
    const prevInvnum = document.getElementById('preview-invnum');
    const prevPo = document.getElementById('preview-po');
    const prevGr = document.getElementById('preview-gr');
    const prevDesc = document.getElementById('preview-item-desc');
    const prevItemTotal = document.getElementById('preview-item-total');
    const prevTotal = document.getElementById('preview-total-due');

    if (prevVendor) prevVendor.textContent = vendor;
    if (prevTaxid) prevTaxid.textContent = `Tax ID: ${taxid}`;
    if (prevInvnum) prevInvnum.textContent = invnum;
    if (prevPo) prevPo.textContent = po;
    if (prevGr) prevGr.textContent = gr;
    if (prevDesc) prevDesc.textContent = `${itemQty}x ${itemDesc}`;
    if (prevItemTotal) prevItemTotal.textContent = `$${(itemQty * itemPrice).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (prevTotal) prevTotal.textContent = `$${invAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    // Update 3-Way Variance Radar
    const radar = document.getElementById('custom-variance-radar');
    if (radar) {
      const diff = invAmt - poAmt;
      const variancePct = poAmt > 0 ? ((diff / poAmt) * 100).toFixed(2) : '0.00';

      if (diff === 0) {
        radar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--emerald-reconciled); font-weight: 800; font-size: 14px;">
            ${icons.checkCircle(18)}
            <span>0.00% Variance • Clean 3-Way Match</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
            Invoice Amount ($${invAmt.toLocaleString()}) perfectly matches Purchase Order ${po} ($${poAmt.toLocaleString()}). Ready for touchless STP automated posting!
          </div>
        `;
      } else {
        radar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--amber-variance); font-weight: 800; font-size: 14px;">
            ${icons.alertTriangle(18)}
            <span>Variance Detected: +$${diff.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${variancePct}%)</span>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 6px;">
            Invoiced total exceeds PO ${po} by +$${diff.toFixed(2)}. Engine will flag discrepancy for CFO approval.
          </div>
        `;
      }
    }
  }

  handleCustomInvoiceSubmit() {
    const vendor = document.getElementById('input-custom-vendor')?.value || 'Custom Vendor';
    const taxid = document.getElementById('input-custom-taxid')?.value || '00-0000000';
    const invnum = document.getElementById('input-custom-invnum')?.value || 'INV-00000';
    const po = document.getElementById('input-custom-po')?.value || 'PO-0000';
    const poAmt = parseFloat(document.getElementById('input-custom-po-amt')?.value || '0');
    const gr = document.getElementById('input-custom-gr')?.value || 'GR-0000';
    const invAmt = parseFloat(document.getElementById('input-custom-inv-amt')?.value || '0');
    const erp = document.getElementById('select-custom-erp')?.value || 'SAP S/4HANA';
    const desc = document.getElementById('input-custom-item-desc')?.value || 'Hardware / Software Services';
    const qty = parseFloat(document.getElementById('input-custom-item-qty')?.value || '1');
    const price = parseFloat(document.getElementById('input-custom-item-price')?.value || '0');
    const gl = document.getElementById('select-custom-gl')?.value || 'GL-1500 Capitalized AI & Server Hardware';

    const diff = invAmt - poAmt;
    const isCleanMatch = (diff === 0);
    const newId = `INV-2026-90${this.data.invoices.length + 1}`;

    const newInvoice = {
      id: newId,
      vendor,
      vendorTaxId: taxid,
      vendorLogo: vendor.slice(0, 2).toUpperCase(),
      vendorLogoColor: isCleanMatch ? "#10B981" : "#F59E0B",
      invoiceNumber: invnum,
      invoiceDate: "Today",
      dueDate: "Net 30",
      totalAmount: invAmt,
      currency: "USD",
      poNumber: po,
      poAmount: poAmt,
      receiptNumber: gr,
      receiptAmount: poAmt,
      varianceAmount: Math.abs(diff),
      variancePercent: poAmt > 0 ? parseFloat(((Math.abs(diff) / poAmt) * 100).toFixed(2)) : 0,
      status: isCleanMatch ? "Reconciled" : "Variance Flagged",
      statusClass: isCleanMatch ? "badge-reconciled" : "badge-variance",
      ocrConfidence: 99.8,
      glCode: gl,
      erpSyncTarget: erp,
      lineItems: [{ desc, qty, unitPrice: price, total: qty * price }],
      auditNotes: isCleanMatch ? 
        `Custom invoice ${invnum} ingested. Exact 3-Way Match verified against PO ${po} ($0.00 variance).` :
        `VARIANCE FLAGGED: Invoiced total exceeds PO ${po} by +$${diff.toFixed(2)}.`
    };

    this.data.invoices.unshift(newInvoice);
    this.data.metrics.totalAmountReconciled += invAmt;
    this.data.metrics.totalInvoicesQuarter++;

    // Update KPI element
    const kpiAmt = document.getElementById('kpi-reconciled-value');
    if (kpiAmt) kpiAmt.textContent = `$${Math.round(this.data.metrics.totalAmountReconciled).toLocaleString()}`;

    // Close create modal
    const modalCreate = document.getElementById('modal-create-invoice');
    if (modalCreate) modalCreate.style.display = 'none';

    // Refresh Queue & switch to it
    this.renderInvoicesQueue();
    this.switchView('view-queue');

    // Run laser scanner preview with the new invoice!
    this.openOcrScanner('preset-clean');
  }

  // ====================================================================
  // CUSTOM INGESTION STUDIO — Full Interactive Lab
  // ====================================================================

  loadStudioPersona(vendor, taxid, invnum, po, poAmt, gr, erp, gl, lineItems, terms, scenario) {
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    set('studio-input-vendor', vendor);
    set('studio-input-taxid', taxid);
    set('studio-input-invnum', invnum);
    set('studio-input-po', po);
    set('studio-input-po-amt', poAmt);
    set('studio-input-gr', gr);
    set('studio-select-erp', erp);
    set('studio-select-gl', gl);
    set('studio-select-terms', terms || 'Net 30');
    set('studio-input-shipping', '0.00');
    set('studio-tax-select', '0');

    this.studioLineItems = lineItems.map((li, i) => ({ id: i + 1, ...li }));
    this.setStudioScenario(scenario || 'clean');
    this.renderStudioLineItems();
    this.updateStudioPreview();
  }

  setStudioScenario(mode) {
    this.studioScenario = mode;
    ['clean', 'variance', 'duplicate'].forEach(m => {
      const btn = document.getElementById(`mode-scenario-${m}`);
      if (!btn) return;
      btn.classList.remove('active-clean', 'active-variance', 'active-duplicate');
    });
    const activeBtn = document.getElementById(`mode-scenario-${mode}`);
    if (activeBtn) activeBtn.classList.add(`active-${mode}`);

    const invAmtHidden = document.getElementById('studio-input-inv-amt');
    const poAmtEl = document.getElementById('studio-input-po-amt');
    if (!invAmtHidden || !poAmtEl) { this.updateStudioPreview(); return; }
    const total = this.calcStudioTotal();

    if (mode === 'variance' && total > 0) {
      poAmtEl.value = (total * 0.92).toFixed(2);
    } else {
      poAmtEl.value = total.toFixed(2);
    }
    this.updateStudioPreview();
  }

  studioAddLineItem() {
    const newId = this.studioLineItems.length > 0
      ? Math.max(...this.studioLineItems.map(li => li.id)) + 1
      : 1;
    this.studioLineItems.push({ id: newId, desc: 'New Line Item', qty: 1, price: 0 });
    this.renderStudioLineItems();
    this.updateStudioPreview();
  }

  studioRemoveLineItem(id) {
    this.studioLineItems = this.studioLineItems.filter(li => li.id !== id);
    this.renderStudioLineItems();
    this.updateStudioPreview();
  }

  renderStudioLineItems() {
    const tbody = document.getElementById('studio-line-items-body');
    if (!tbody) return;

    tbody.innerHTML = this.studioLineItems.map(li => `
      <tr id="studio-li-row-${li.id}">
        <td><input type="text" value="${li.desc}" data-li-id="${li.id}" data-li-field="desc" style="min-width: 180px;"></td>
        <td><input type="number" value="${li.qty}" min="1" data-li-id="${li.id}" data-li-field="qty" style="width: 60px;"></td>
        <td><input type="number" value="${li.price}" step="0.01" data-li-id="${li.id}" data-li-field="price" style="width: 100px; font-family: 'JetBrains Mono', monospace;"></td>
        <td style="text-align: right;">
          <span class="mono-font" style="color: #FFFFFF; font-weight: 800; font-size: 12px;" id="studio-li-total-${li.id}">
            $${(li.qty * li.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </td>
        <td>
          <button type="button" class="btn-remove-line" onclick="window.procureApp.studioRemoveLineItem(${li.id})">
            ${icons.trash(14)}
          </button>
        </td>
      </tr>
    `).join('');

    tbody.querySelectorAll('input[data-li-id]').forEach(input => {
      input.addEventListener('input', () => {
        const liId = parseInt(input.dataset.liId);
        const field = input.dataset.liField;
        const li = this.studioLineItems.find(x => x.id === liId);
        if (!li) return;
        if (field === 'desc')  li.desc  = input.value;
        if (field === 'qty')   li.qty   = parseFloat(input.value) || 0;
        if (field === 'price') li.price = parseFloat(input.value) || 0;
        const totEl = document.getElementById(`studio-li-total-${liId}`);
        if (totEl) totEl.textContent = `$${(li.qty * li.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        this.updateStudioPreview();
      });
    });
  }

  calcStudioTotal() {
    const subtotal = this.studioLineItems.reduce((s, li) => s + li.qty * li.price, 0);
    const taxPct = parseFloat(document.getElementById('studio-tax-select')?.value || '0') / 100;
    const shipping = parseFloat(document.getElementById('studio-input-shipping')?.value || '0');
    return subtotal + (subtotal * taxPct) + shipping;
  }

  updateStudioPreview() {
    const get = id => document.getElementById(id)?.value || '';
    const vendor = get('studio-input-vendor') || 'Vendor Legal Name';
    const taxid  = get('studio-input-taxid')  || 'XX-XXXXXXX';
    const invnum = get('studio-input-invnum') || 'INV-000000';
    const po     = get('studio-input-po')     || 'PO-0000';
    const gr     = get('studio-input-gr')     || 'GR-0000';
    const terms  = get('studio-select-terms') || 'Net 30';
    const poAmt  = parseFloat(get('studio-input-po-amt')) || 0;
    const erp    = get('studio-select-erp') || 'SAP S/4HANA';
    const glCode = get('studio-select-gl') || 'GL-1500';

    const total = this.calcStudioTotal();
    const invAmtHidden = document.getElementById('studio-input-inv-amt');
    if (invAmtHidden) invAmtHidden.value = total.toFixed(2);
    const totalDisplay = document.getElementById('studio-total-display');
    if (totalDisplay) totalDisplay.textContent = `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('studio-prev-vendor', vendor);
    setEl('studio-prev-taxid', `Tax ID: ${taxid}`);
    setEl('studio-prev-invnum', invnum);
    setEl('studio-prev-po', po);
    setEl('studio-prev-gr', gr);
    setEl('studio-prev-terms', terms);
    setEl('studio-prev-total', `$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}`);

    const prevItems = document.getElementById('studio-prev-items-list');
    if (prevItems) {
      prevItems.innerHTML = this.studioLineItems.map(li => `
        <div style="display: flex; justify-content: space-between; font-size: 11px; background: #F3F4F6; padding: 6px 10px; border-radius: 4px; margin-bottom: 4px;">
          <span style="color: #374151; max-width: 70%;">${li.qty}x ${li.desc}</span>
          <span class="mono-font" style="font-weight: 800; color: #111827;">$${(li.qty * li.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      `).join('');
    }

    const diff = total - poAmt;
    const variancePct = poAmt > 0 ? ((diff / poAmt) * 100).toFixed(2) : '0.00';
    const isDuplicate = this.studioScenario === 'duplicate';
    const isVariance  = !isDuplicate && diff !== 0;
    const isClean     = !isDuplicate && !isVariance;

    // Holographic stamp
    const stamp = document.getElementById('studio-holo-stamp');
    if (stamp) {
      stamp.className = 'holo-stamp';
      if (isDuplicate)   { stamp.classList.add('holo-stamp-duplicate');   stamp.textContent = 'DUPLICATE BLOCKED • FRAUD RISK'; }
      else if (isVariance) { stamp.classList.add('holo-stamp-variance'); stamp.textContent = `VARIANCE +${variancePct}% • CFO HOLD`; }
      else               { stamp.classList.add('holo-stamp-reconciled'); stamp.textContent = '3-WAY MATCH VERIFIED • STP READY'; }
    }

    // Variance radar
    const radar = document.getElementById('studio-variance-radar');
    if (radar) {
      if (isDuplicate) {
        radar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--crimson-alert); font-weight: 800; font-size: 14px; margin-bottom: 8px;">
            ${icons.copy(18)} <span>Duplicate Invoice Detected — Payment BLOCKED</span>
          </div>
          <div style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 8px; padding: 12px; font-size: 12px; color: var(--text-secondary); line-height: 1.6;">
            Invoice <strong>${invnum}</strong> matches an existing ledger entry. ProcureBot's deduplication engine has flagged this as a potential double-billing or resubmission fraud risk. Payment authorization has been automatically suspended.
          </div>`;
      } else if (isVariance) {
        radar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--amber-variance); font-weight: 800; font-size: 14px; margin-bottom: 8px;">
            ${icons.alertTriangle(18)} <span>Variance Detected: +$${diff.toLocaleString('en-US', { minimumFractionDigits: 2 })} (+${variancePct}%)</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div style="background: var(--bg-input); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">PO CONTRACT</div>
              <div class="mono-font" style="font-weight: 800; color: var(--brand-cyan); font-size: 13px;">$${poAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: var(--bg-input); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">INVOICED</div>
              <div class="mono-font" style="font-weight: 800; color: var(--amber-variance); font-size: 13px;">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">DISCREPANCY</div>
              <div class="mono-font" style="font-weight: 800; color: var(--amber-variance); font-size: 13px;">+$${diff.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">Invoice total exceeds approved PO ${po} by $${diff.toFixed(2)}. Requires CFO-level override before ERP posting.</div>`;
      } else {
        radar.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; color: var(--emerald-reconciled); font-weight: 800; font-size: 14px; margin-bottom: 8px;">
            ${icons.checkCircle(18)} <span>Exact 3-Way Match • $0.00 Variance • STP Ready</span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 8px;">
            <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">PO CONTRACT</div>
              <div class="mono-font" style="font-weight: 800; color: var(--emerald-reconciled); font-size: 13px;">$${poAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">GR RECEIPT</div>
              <div class="mono-font" style="font-weight: 800; color: var(--emerald-reconciled); font-size: 13px;">$${poAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.3); padding: 8px 10px; border-radius: 6px; text-align: center;">
              <div style="font-size: 10px; color: var(--text-muted); font-weight: 700;">INVOICED</div>
              <div class="mono-font" style="font-weight: 800; color: var(--emerald-reconciled); font-size: 13px;">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div style="font-size: 12px; color: var(--text-secondary);">All three documents agree perfectly. Autonomous STP journal entry will post to ${erp} within 28 seconds.</div>`;
      }
    }

    // GL Posting Preview
    const glPreview = document.getElementById('studio-gl-preview');
    if (glPreview) {
      const glShort = glCode.split(' ').slice(0, 2).join(' ');
      glPreview.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; padding: 8px 12px; border-radius: 6px; background: var(--bg-input);">
            <span style="color: var(--text-muted); font-weight: 700;">DR ${glShort} — Expense/Asset</span>
            <span class="mono-font" style="color: var(--emerald-reconciled); font-weight: 800;">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; padding: 8px 12px; border-radius: 6px; background: var(--bg-input);">
            <span style="color: var(--text-muted); font-weight: 700;">CR AP-2000 — Accounts Payable Liability</span>
            <span class="mono-font" style="color: var(--brand-cyan); font-weight: 800;">$${total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
          <div style="font-size: 11px; color: var(--text-muted); margin-top: 4px; padding: 6px 10px; border-left: 2px solid var(--brand-cyan);">
            Target ERP: <strong style="color: #FFFFFF;">${erp}</strong> • JE will auto-post upon STP clearance.
          </div>
        </div>`;
    }
  }

  handleStudioSubmit() {
    const get = id => document.getElementById(id)?.value || '';
    const vendor = get('studio-input-vendor') || 'Custom Vendor';
    const taxid  = get('studio-input-taxid')  || '00-0000000';
    const invnum = get('studio-input-invnum') || 'INV-00000';
    const po     = get('studio-input-po')     || 'PO-0000';
    const poAmt  = parseFloat(get('studio-input-po-amt')) || 0;
    const gr     = get('studio-input-gr')     || 'GR-0000';
    const erp    = get('studio-select-erp')   || 'SAP S/4HANA';
    const gl     = get('studio-select-gl')    || 'GL-1500 Capitalized AI & Server Hardware';
    const total  = this.calcStudioTotal();
    const isDuplicate = this.studioScenario === 'duplicate';
    const diff   = total - poAmt;
    const isClean = !isDuplicate && diff === 0;
    const variancePct = poAmt > 0 ? parseFloat(((Math.abs(diff) / poAmt) * 100).toFixed(2)) : 0;

    let status, statusClass, color;
    if (isDuplicate) { status = 'Duplicate Warning'; statusClass = 'badge-duplicate'; color = '#EF4444'; }
    else if (!isClean) { status = 'Variance Flagged'; statusClass = 'badge-variance'; color = '#F59E0B'; }
    else { status = 'Reconciled'; statusClass = 'badge-reconciled'; color = '#10B981'; }

    const newId = `INV-2026-90${this.data.invoices.length + 1}`;
    const newInvoice = {
      id: newId, vendor, vendorTaxId: taxid,
      vendorLogo: vendor.slice(0, 2).toUpperCase(), vendorLogoColor: color,
      invoiceNumber: invnum, invoiceDate: 'Today', dueDate: 'Net 30',
      totalAmount: total, currency: 'USD',
      poNumber: po, poAmount: poAmt, receiptNumber: gr, receiptAmount: poAmt,
      varianceAmount: Math.abs(diff), variancePercent: variancePct,
      status, statusClass, ocrConfidence: 99.8, glCode: gl, erpSyncTarget: erp,
      lineItems: this.studioLineItems.map(li => ({ desc: li.desc, qty: li.qty, unitPrice: li.price, total: li.qty * li.price })),
      auditNotes: isDuplicate
        ? `FRAUD PREVENTION: Invoice ${invnum} matched an existing ledger record. Payment blocked.`
        : isClean
          ? `Studio ingestion ${invnum}. Exact 3-Way Match vs PO ${po} ($0.00 variance).`
          : `VARIANCE FLAGGED: ${invnum} exceeds PO ${po} by +$${diff.toFixed(2)} (${variancePct}%).`
    };

    this.data.invoices.unshift(newInvoice);
    this.data.metrics.totalAmountReconciled += total;
    this.data.metrics.totalInvoicesQuarter++;
    const kpiEl = document.getElementById('kpi-reconciled-value');
    if (kpiEl) kpiEl.textContent = `$${Math.round(this.data.metrics.totalAmountReconciled).toLocaleString()}`;

    this.renderInvoicesQueue();
    this.switchView('view-queue');
    setTimeout(() => {
      const row = document.getElementById(`row-${newId}`);
      if (row) row.classList.add('row-new-pulse');
    }, 300);
    this.openOcrScanner('preset-clean');
    this.showToast(
      isDuplicate ? `Duplicate blocked: ${invnum}` : isClean ? `Ingested & matched: ${invnum}` : `Variance flagged: ${invnum}`,
      isDuplicate ? 'var(--crimson-alert)' : isClean ? 'var(--emerald-reconciled)' : 'var(--amber-variance)'
    );
  }

  studioRandomize() {
    const vendors = [
      { name: 'Microsoft Azure',       taxid: '91-1144442', invPfx: 'MSFT-AZ',  po: 'PO-9001', poAmt: 28600, gr: 'GR-2001', erp: 'Oracle NetSuite',   gl: 'GL-6200 Cloud Telemetry & Observability', items: [{ id:1, desc:'Azure Compute Flex Reserved Instances (1-Year)', qty:12, price:2383.33 }], scenario: 'clean' },
      { name: 'Palantir Technologies', taxid: '68-0492481', invPfx: 'PLTR-ENT', po: 'PO-9002', poAmt: 61000, gr: 'GR-2002', erp: 'SAP S/4HANA',       gl: 'GL-6400 General IT & Software Operations', items: [{ id:1, desc:'Palantir AIP Enterprise Analytics Platform License', qty:1, price:61000 }], scenario: 'variance' },
      { name: 'UPS Supply Chain',      taxid: '58-1300445', invPfx: 'UPS-SCM',  po: 'PO-9003', poAmt: 8200,  gr: 'GR-2003', erp: 'QuickBooks Enterprise', gl: 'GL-6500 Corporate Freight & Logistics',  items: [{ id:1, desc:'LTL Freight Priority Shipment International Tier 2', qty:4, price:2050 }], scenario: 'clean' },
      { name: 'Databricks Inc.',       taxid: '47-2340190', invPfx: 'DBX-ENT',  po: 'PO-9004', poAmt: 33500, gr: 'GR-2004', erp: 'Oracle NetSuite',   gl: 'GL-6210 Enterprise Data Warehouse',        items: [{ id:1, desc:'Databricks Lakehouse Platform DBU Compute (Annual)', qty:1, price:33500 }], scenario: 'clean' },
      { name: 'Cisco Meraki',          taxid: '94-2901844', invPfx: 'MERAKI',   po: 'PO-9005', poAmt: 19800, gr: 'GR-2005', erp: 'Workday Financials', gl: 'GL-1500 Capitalized AI & Server Hardware', items: [{ id:1, desc:'Meraki MX450 Enterprise Security Appliance 3-Year', qty:2, price:9900 }], scenario: 'duplicate' },
    ];
    const v = vendors[Math.floor(Math.random() * vendors.length)];
    const invNum = `${v.invPfx}-${Math.floor(10000 + Math.random() * 89999)}`;
    this.loadStudioPersona(v.name, v.taxid, invNum, v.po, v.poAmt, v.gr, v.erp, v.gl, v.items, 'Net 30', v.scenario);
    document.querySelectorAll('.persona-chip-btn').forEach(b => b.classList.remove('active'));
    this.showToast(`Loaded random invoice: ${v.name}`, 'var(--brand-cyan)');
  }

  generateBatch5() {
    const ts = Date.now().toString().slice(-5);
    const samples = [
      { vendor:'Vercel Inc.',       logo:'VC', invnum:`VCL-${ts}1`,  po:'PO-9100', poAmt:4200,  total:4200,  erp:'Oracle NetSuite',     gl:'GL-6200 Cloud Telemetry & Observability',  status:'Reconciled',      sc:'badge-reconciled', col:'#10B981', var:0,    varPct:0 },
      { vendor:'Grafana Labs',      logo:'GL', invnum:`GRFN-${ts}2`, po:'PO-9101', poAmt:7800,  total:7800,  erp:'SAP S/4HANA',         gl:'GL-6200 Cloud Telemetry & Observability',  status:'Reconciled',      sc:'badge-reconciled', col:'#10B981', var:0,    varPct:0 },
      { vendor:'Confluent Cloud',   logo:'CC', invnum:`CNFL-${ts}3`, po:'PO-9102', poAmt:11200, total:12800, erp:'SAP S/4HANA',         gl:'GL-6210 Enterprise Data Warehouse',         status:'Variance Flagged',sc:'badge-variance',   col:'#F59E0B', var:1600, varPct:14.29 },
      { vendor:'Stripe Enterprise', logo:'SP', invnum:`STRP-${ts}4`, po:'PO-9103', poAmt:3100,  total:3100,  erp:'Workday Financials',  gl:'GL-6400 General IT & Software Operations', status:'Reconciled',      sc:'badge-reconciled', col:'#10B981', var:0,    varPct:0 },
      { vendor:'HashiCorp Inc.',    logo:'HC', invnum:`HCORP-${ts}5`,po:'PO-9104', poAmt:16500, total:16500, erp:'Oracle NetSuite',     gl:'GL-6400 General IT & Software Operations', status:'Pending Review',  sc:'badge-pending',    col:'#06B6D4', var:0,    varPct:0 },
    ];
    samples.forEach((s, i) => {
      const newId = `INV-2026-B5${this.data.invoices.length + i + 1}`;
      this.data.invoices.unshift({
        id: newId, vendor: s.vendor, vendorTaxId: '00-0000000',
        vendorLogo: s.logo, vendorLogoColor: s.col,
        invoiceNumber: s.invnum, invoiceDate: 'Today', dueDate: 'Net 30',
        totalAmount: s.total, currency: 'USD',
        poNumber: s.po, poAmount: s.poAmt, receiptNumber: `GR-B${i+1}`, receiptAmount: s.poAmt,
        varianceAmount: s.var, variancePercent: s.varPct,
        status: s.status, statusClass: s.sc,
        ocrConfidence: parseFloat((99 + Math.random()).toFixed(1)),
        glCode: s.gl, erpSyncTarget: s.erp,
        lineItems: [{ desc: `${s.vendor} Services`, qty: 1, unitPrice: s.total, total: s.total }],
        auditNotes: `Batch-generated record for demo. Status: ${s.status}.`
      });
      this.data.metrics.totalAmountReconciled += s.total;
      this.data.metrics.totalInvoicesQuarter++;
    });
    this.renderInvoicesQueue();
    this.switchView('view-queue');
    this.showToast('5 batch invoices generated & ingested into the queue!', 'var(--brand-cyan)');
  }

  showToast(message, color = 'var(--brand-cyan)') {
    const container = document.getElementById('procure-toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'procure-toast';
    toast.innerHTML = `
      <div style="width: 4px; height: 36px; border-radius: 2px; background: ${color}; flex-shrink: 0;"></div>
      <div style="flex: 1;">
        <div style="font-size: 13px; font-weight: 700;">${message}</div>
        <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">ProcureBot AP Engine • ${new Date().toLocaleTimeString()}</div>
      </div>
    `;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(110%)'; toast.style.transition = 'all 0.4s ease'; setTimeout(() => toast.remove(), 400); }, 4600);
  }

  switchView(viewId) {
    this.currentView = viewId;

    const views = ['view-intro', 'view-overview', 'view-queue', 'view-studio', 'view-calculator', 'view-aging', 'view-erp'];
    views.forEach(v => {
      const el = document.getElementById(v);
      if (el) el.style.display = (v === viewId) ? 'flex' : 'none';
    });

    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.view === viewId);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ====================================================================
  // CHARTS: MONTHLY VOLUME & STP AREA CHART
  // ====================================================================
  renderVolumeChart() {
    const container = document.getElementById('svg-volume-chart-wrapper');
    if (!container) return;

    const trends = this.data.monthlyTrends;
    const maxVal = 1800;
    const width = 800;
    const height = 200;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const chartW = width - paddingLeft - 20;
    const chartH = height - paddingBottom - 20;

    // Generate points
    const stepX = chartW / (trends.length - 1);
    const totalPoints = trends.map((t, i) => ({
      x: paddingLeft + i * stepX,
      y: 20 + chartH - (t.total / maxVal) * chartH
    }));

    const stpPoints = trends.map((t, i) => ({
      x: paddingLeft + i * stepX,
      y: 20 + chartH - (t.automated / maxVal) * chartH
    }));

    const totalPath = totalPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const stpPath = stpPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    const stpArea = `${stpPath} L ${stpPoints[stpPoints.length - 1].x} ${20 + chartH} L ${stpPoints[0].x} ${20 + chartH} Z`;

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" style="width: 100%; height: 100%; overflow: visible;">
        <defs>
          <linearGradient id="stpGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#06B6D4" stop-opacity="0.0"/>
          </linearGradient>
        </defs>

        <!-- Horizontal Gridlines -->
        <line x1="${paddingLeft}" y1="20" x2="${width - 20}" y2="20" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
        <line x1="${paddingLeft}" y1="${20 + chartH * 0.5}" x2="${width - 20}" y2="${20 + chartH * 0.5}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="4"/>
        <line x1="${paddingLeft}" y1="${20 + chartH}" x2="${width - 20}" y2="${20 + chartH}" stroke="rgba(255,255,255,0.12)"/>

        <!-- Y Axis Labels -->
        <text x="5" y="25" fill="#6B7280" font-size="11" font-family="JetBrains Mono">1,800</text>
        <text x="5" y="${25 + chartH * 0.5}" fill="#6B7280" font-size="11" font-family="JetBrains Mono">900</text>
        <text x="5" y="${25 + chartH}" fill="#6B7280" font-size="11" font-family="JetBrains Mono">0</text>

        <!-- Area & Lines -->
        <path d="${stpArea}" fill="url(#stpGradient)"/>
        <path d="${totalPath}" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="2" stroke-dasharray="3 3"/>
        <path d="${stpPath}" fill="none" stroke="#06B6D4" stroke-width="3" stroke-linecap="round"/>

        <!-- Data Dots & X Labels -->
        ${stpPoints.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="4.5" fill="#06B6D4" stroke="#0B101D" stroke-width="2"/>
          <text x="${p.x}" y="${height - 6}" fill="#9CA3AF" font-size="11" font-weight="700" text-anchor="middle">
            ${trends[i].month.split(' ')[0]}
          </text>
          <text x="${p.x}" y="${p.y - 10}" fill="#34D399" font-size="10" font-family="JetBrains Mono" font-weight="800" text-anchor="middle">
            ${trends[i].stp}%
          </text>
        `).join('')}
      </svg>
    `;
  }

  // ====================================================================
  // CHARTS: AP AGING PROGRESS BARS
  // ====================================================================
  renderAgingBars() {
    const container = document.getElementById('ap-aging-bars-wrapper');
    if (!container) return;

    container.innerHTML = this.data.apAging.map(aging => `
      <div class="aging-bar-row">
        <div class="aging-bar-labels">
          <span style="color: var(--text-secondary);">${aging.bucket}</span>
          <span class="mono-font" style="color: ${aging.color};">$${(aging.amount / 1000000).toFixed(2)}M (${aging.percentage}%)</span>
        </div>
        <div class="aging-bar-track">
          <div class="aging-bar-fill" style="width: ${aging.percentage}%; background: ${aging.color};"></div>
        </div>
      </div>
    `).join('');
  }

  // ====================================================================
  // CHARTS: SPEND BY CATEGORY DONUT CHART
  // ====================================================================
  renderSpendDonut() {
    const container = document.getElementById('spend-donut-container');
    if (!container) return;

    const categories = this.data.vendorCategories;
    const total = categories.reduce((sum, c) => sum + c.amount, 0);

    let cumulativeAngle = 0;
    const radius = 70;
    const strokeWidth = 24;
    const circumference = 2 * Math.PI * radius;

    const arcs = categories.map(cat => {
      const sliceAngle = (cat.amount / total) * 360;
      const strokeDashoffset = circumference - (cat.amount / total) * circumference;
      const rotation = cumulativeAngle;
      cumulativeAngle += sliceAngle;

      return `
        <circle cx="100" cy="100" r="${radius}" fill="none" stroke="${cat.color}" stroke-width="${strokeWidth}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}"
          transform="rotate(${rotation - 90} 100 100)" style="transition: all 0.5s ease; cursor: pointer;"/>
      `;
    }).join('');

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 32px; flex-wrap: wrap;">
        <svg width="200" height="200" viewBox="0 0 200 200">
          ${arcs}
          <text x="100" y="95" text-anchor="middle" font-size="18" font-weight="900" fill="#FFFFFF" class="mono-font">$14.8M</text>
          <text x="100" y="115" text-anchor="middle" font-size="11" font-weight="700" fill="#6B7280">Q3 Reconciled</text>
        </svg>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${categories.map(c => `
            <div style="display: flex; align-items: center; gap: 10px; font-size: 13px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: ${c.color};"></span>
              <span style="color: var(--text-secondary); width: 150px;">${c.name}</span>
              <strong class="mono-font" style="color: #FFFFFF;">${c.share}%</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ====================================================================
  // INVOICES QUEUE & 3-WAY RECONCILIATION TABLE
  // ====================================================================
  renderInvoicesQueue(filteredList = null) {
    const tbody = document.getElementById('invoices-table-body');
    if (!tbody) return;

    const list = filteredList || this.data.invoices;

    // Update pending counter in tab
    const counter = document.getElementById('queue-pending-count');
    if (counter) counter.textContent = list.length;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-muted);">
            No invoices match the selected filter criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map(inv => `
      <tr id="row-${inv.id}">
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 6px; background: ${inv.vendorLogoColor}; color: #FFFFFF; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 12px;">
              ${inv.vendorLogo}
            </div>
            <div>
              <strong style="color: #FFFFFF;">${inv.vendor}</strong>
              <div style="font-size: 12px; color: var(--text-muted);">${inv.invoiceNumber}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="mono-font" style="color: var(--brand-cyan);">${inv.poNumber}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${inv.receiptNumber}</div>
        </td>
        <td>
          <span class="mono-font" style="font-weight: 800; color: #FFFFFF;">$${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </td>
        <td>
          ${inv.varianceAmount === 0 ? `
            <span class="mono-font" style="color: var(--emerald-reconciled); font-size: 13px;">$0.00 (0%)</span>
          ` : `
            <span class="mono-font" style="color: var(--amber-variance); font-weight: 800; font-size: 13px;">+$${inv.varianceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${inv.variancePercent}%)</span>
          `}
        </td>
        <td>
          <span class="mono-font" style="color: var(--text-cyan); font-weight: 700;">${inv.ocrConfidence}%</span>
        </td>
        <td>
          <span class="badge-status ${inv.statusClass}">${inv.status}</span>
        </td>
        <td>
          <span class="mono-font" style="font-size: 12px; color: var(--text-secondary);">${inv.glCode.split(' ')[0]}</span>
        </td>
        <td>
          <button class="btn-procure btn-procure-ghost" style="padding: 6px 12px; font-size: 12px;" onclick="window.procureApp.openInspector('${inv.id}')">
            <span>Inspect 3-Way</span>
          </button>
        </td>
      </tr>
    `).join('');
  }

  filterQueue() {
    const query = (document.getElementById('input-search-queue')?.value || '').toLowerCase();
    const status = document.getElementById('filter-queue-status')?.value || 'all';

    const filtered = this.data.invoices.filter(inv => {
      const matchesSearch = inv.vendor.toLowerCase().includes(query) ||
                            inv.invoiceNumber.toLowerCase().includes(query) ||
                            inv.poNumber.toLowerCase().includes(query) ||
                            inv.glCode.toLowerCase().includes(query);

      const matchesStatus = (status === 'all') || (inv.status === status);

      return matchesSearch && matchesStatus;
    });

    this.renderInvoicesQueue(filtered);
  }

  handleBatchApprove() {
    let approvedCount = 0;
    this.data.invoices.forEach(inv => {
      if (inv.status === 'Reconciled') {
        approvedCount++;
      }
    });

    alert(`Batch Approved: ${approvedCount} reconciled invoices posted directly to SAP S/4HANA & NetSuite general ledgers! Zero manual entry required.`);
  }

  // ====================================================================
  // FINANCIAL ROI & COST CALCULATOR
  // ====================================================================
  updateRoiCalculations() {
    const volume = parseInt(document.getElementById('slider-invoices')?.value || '2500', 10);
    const rate = parseFloat(document.getElementById('slider-rate')?.value || '45');
    const manualMins = parseFloat(document.getElementById('slider-mins')?.value || '15');

    // Update label tags
    const valInvoices = document.getElementById('val-slider-invoices');
    const valRate = document.getElementById('val-slider-rate');
    const valMins = document.getElementById('val-slider-mins');

    if (valInvoices) valInvoices.textContent = volume.toLocaleString();
    if (valRate) valRate.textContent = `$${rate.toFixed(2)}`;
    if (valMins) valMins.textContent = `${manualMins} mins`;

    // Mathematical Model
    const manualHoursMonthly = (volume * manualMins) / 60;
    const automatedHoursMonthly = (volume * 0.5) / 60; // 30 sec per invoice
    const hoursSavedMonthly = manualHoursMonthly - automatedHoursMonthly;

    const monthlyLaborSavings = hoursSavedMonthly * rate;
    const annualLaborSavings = monthlyLaborSavings * 12;

    // Error & Duplicate Prevention Savings
    const duplicateSavings = volume * 0.028 * 0.03 * 1850.00 * 12; // 2.8% errors caught
    const totalAnnualSavings = annualLaborSavings + duplicateSavings;

    // Software Cost Assumption ($24,000/yr) -> ROI
    const softwareAnnualCost = 24000;
    const roiMultiplier = Math.round((totalAnnualSavings / softwareAnnualCost) * 100);

    // Update DOM outputs
    const elAnnualSavings = document.getElementById('calc-annual-savings');
    const elHoursSaved = document.getElementById('calc-hours-saved');
    const elRoiMultiplier = document.getElementById('calc-roi-multiplier');
    const elDuplicateAvoidance = document.getElementById('calc-duplicate-avoidance');

    if (elAnnualSavings) elAnnualSavings.textContent = `$${Math.round(totalAnnualSavings).toLocaleString()}`;
    if (elHoursSaved) elHoursSaved.textContent = `${Math.round(hoursSavedMonthly).toLocaleString()} hrs`;
    if (elRoiMultiplier) elRoiMultiplier.textContent = `${roiMultiplier}%`;
    if (elDuplicateAvoidance) elDuplicateAvoidance.textContent = `$${Math.round(duplicateSavings).toLocaleString()}`;
  }

  // ====================================================================
  // HOLOGRAPHIC OCR SCANNER & REAL-TIME LOADING SCREEN
  // ====================================================================
  openOcrScanner(presetId = 'preset-clean') {
    const modal = document.getElementById('modal-scanner');
    if (!modal) return;

    modal.style.display = 'flex';
    this.runScannerScenario(presetId);
  }

  closeOcrScanner() {
    const modal = document.getElementById('modal-scanner');
    if (modal) modal.style.display = 'none';
    if (this.scanInterval) clearInterval(this.scanInterval);
  }

  runScannerScenario(scenarioId) {
    if (this.scanInterval) clearInterval(this.scanInterval);

    const stream = document.getElementById('scanner-terminal-stream');
    const docVendor = document.getElementById('scan-doc-vendor');
    const docInvNum = document.getElementById('scan-doc-inv-num');
    const docPoRef = document.getElementById('scan-doc-po-ref');
    const docLineDesc = document.getElementById('scan-doc-line-desc');
    const docLineAmt = document.getElementById('scan-doc-line-amt');
    const docTotalAmt = document.getElementById('scan-doc-total-amt');

    if (!stream) return;
    stream.innerHTML = '';

    let logs = [];
    if (scenarioId === 'preset-clean') {
      if (docVendor) docVendor.textContent = "Datadog, Inc.";
      if (docInvNum) docInvNum.textContent = "DD-948102-US";
      if (docPoRef) docPoRef.textContent = "PO-8841";
      if (docLineDesc) docLineDesc.textContent = "Datadog Infrastructure Pro - Host Units";
      if (docLineAmt) docLineAmt.textContent = "$11,500.00";
      if (docTotalAmt) docTotalAmt.textContent = "$14,250.00";

      logs = [
        { text: "[0.12s] Ingesting document buffer (PDF 300 DPI, 2.4 MB)...", type: "info" },
        { text: "[0.45s] Neural OCR segmentation: Detected 14 layout bounding boxes", type: "info" },
        { text: "[0.88s] Entity extraction: Vendor 'Datadog, Inc.' (Tax ID: 45-2984102) [Confidence: 99.9%]", type: "info" },
        { text: "[1.24s] Line items extracted: 2 services detected ($14,250.00 subtotal)", type: "info" },
        { text: "[1.65s] 3-Way Match: Querying ERP PO #PO-8841 and Goods Receipt #GR-1049...", type: "info" },
        { text: "[2.10s] ✓ Ledger reconciliation: 0.00% variance. Reconciled to GL-6200!", type: "success" }
      ];
    } else if (scenarioId === 'preset-variance') {
      if (docVendor) docVendor.textContent = "Dell Technologies";
      if (docInvNum) docInvNum.textContent = "DELL-INV-80219";
      if (docPoRef) docPoRef.textContent = "PO-8815";
      if (docLineDesc) docLineDesc.textContent = "PowerEdge R760 2U Rack Server Dual Intel Xeon";
      if (docLineAmt) docLineAmt.textContent = "$34,500.00";
      if (docTotalAmt) docTotalAmt.textContent = "$42,650.00";

      logs = [
        { text: "[0.15s] Ingesting hardware invoice buffer...", type: "info" },
        { text: "[0.62s] Vendor recognized: Dell Technologies (Contract Rate Table: Tier 1)", type: "info" },
        { text: "[1.10s] Extracted line items: 3 hardware asset entries ($42,650.00)", type: "info" },
        { text: "[1.55s] 3-Way Match: Comparing against Purchase Order #PO-8815 ($39,900.00)...", type: "info" },
        { text: "[2.20s] ⚠️ VARIANCE FLAGGED: Unit rate on 64GB DDR5 RAM billed at $410 vs contracted $350 (+6.89% / +$2,750.00 discrepancy)", type: "warn" }
      ];
    } else {
      if (docVendor) docVendor.textContent = "FedEx Corporate Logistics";
      if (docInvNum) docInvNum.textContent = "FDX-90142-USA";
      if (docPoRef) docPoRef.textContent = "PO-8799";
      if (docLineDesc) docLineDesc.textContent = "Dedicated LTL Expedited Freight";
      if (docLineAmt) docLineAmt.textContent = "$3,020.50";
      if (docTotalAmt) docTotalAmt.textContent = "$3,420.50";

      logs = [
        { text: "[0.10s] Ingesting logistics receipt buffer...", type: "info" },
        { text: "[0.50s] OCR Hash generation: SHA-256 fingerprint computed", type: "info" },
        { text: "[0.95s] General Ledger query: Searching historical payment records...", type: "info" },
        { text: "[1.80s] 🛑 DUPLICATE BLOCKED: Identical invoice #FDX-90142-USA settled on Sep 24, 2026. Fraud prevention lock engaged!", type: "warn" }
      ];
    }

    let i = 0;
    this.scanInterval = setInterval(() => {
      if (i < logs.length) {
        const item = logs[i];
        const p = document.createElement('div');
        p.className = `terminal-line ${item.type}`;
        p.textContent = item.text;
        stream.appendChild(p);
        stream.scrollTop = stream.scrollHeight;
        i++;
      } else {
        clearInterval(this.scanInterval);
      }
    }, 450);
  }

  // ====================================================================
  // SPLIT-SCREEN 3-WAY RECONCILIATION INSPECTOR MODAL
  // ====================================================================
  openInspector(invoiceId) {
    const inv = this.data.invoices.find(i => i.id === invoiceId);
    if (!inv) return;

    this.activeInspectorInvoice = inv;
    const modal = document.getElementById('modal-inspector');
    if (!modal) return;

    const titleEl = document.getElementById('inspector-title');
    const subEl = document.getElementById('inspector-subtitle');
    const docBody = document.getElementById('inspector-doc-body');
    const matrix = document.getElementById('inspector-matrix');
    const varianceBox = document.getElementById('inspector-variance-box');

    if (titleEl) titleEl.innerHTML = `3-Way Reconciliation Inspector • <span class="mono-font">${inv.id}</span>`;
    if (subEl) subEl.textContent = `${inv.vendor} • ${inv.poNumber} vs Goods Receipt ${inv.receiptNumber}`;

    if (docBody) {
      docBody.innerHTML = `
        <div style="border-bottom: 2px solid #E5E7EB; padding-bottom: 12px; margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between;">
            <div>
              <strong style="font-size: 16px; color: #111827;">${inv.vendor}</strong>
              <div style="color: #6B7280; font-size: 11px;">Tax ID: ${inv.vendorTaxId}</div>
            </div>
            <div style="text-align: right;">
              <span class="mono-font" style="font-weight: 800; color: #0284C7;">${inv.invoiceNumber}</span>
              <div style="color: #6B7280; font-size: 11px;">Date: ${inv.invoiceDate}</div>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 14px; font-size: 12px;">
          <div><strong>PO Reference:</strong> ${inv.poNumber}</div>
          <div><strong>Payment Terms:</strong> ${inv.dueDate}</div>
          <div><strong>GL Allocation:</strong> ${inv.glCode}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; font-size: 11px;">
          <thead>
            <tr style="background: #F3F4F6; text-align: left;">
              <th style="padding: 6px;">Description</th>
              <th style="padding: 6px; text-align: center;">Qty</th>
              <th style="padding: 6px; text-align: right;">Unit Price</th>
              <th style="padding: 6px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${inv.lineItems.map(item => `
              <tr style="border-bottom: 1px solid #E5E7EB;">
                <td style="padding: 6px; font-weight: 700;">${item.desc}</td>
                <td style="padding: 6px; text-align: center;">${item.qty}</td>
                <td style="padding: 6px; text-align: right;" class="mono-font">$${item.unitPrice.toFixed(2)}</td>
                <td style="padding: 6px; text-align: right; font-weight: 800;" class="mono-font">$${item.total.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div style="text-align: right; font-size: 16px; font-weight: 900; color: #111827;">
          Total: <span class="mono-font">$${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      `;
    }

    if (matrix) {
      matrix.innerHTML = `
        <div style="background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 800;">1. VENDOR INVOICE</div>
          <div class="mono-font" style="font-size: 18px; font-weight: 900; color: #FFFFFF; margin-top: 4px;">
            $${inv.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${inv.invoiceNumber}</div>
        </div>

        <div style="background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 800;">2. PURCHASE ORDER</div>
          <div class="mono-font" style="font-size: 18px; font-weight: 900; color: var(--brand-cyan); margin-top: 4px;">
            $${inv.poAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${inv.poNumber}</div>
        </div>

        <div style="background: var(--bg-surface); padding: 14px; border-radius: 8px; border: 1px solid var(--border-subtle);">
          <div style="font-size: 11px; color: var(--text-muted); font-weight: 800;">3. GOODS RECEIPT</div>
          <div class="mono-font" style="font-size: 18px; font-weight: 900; color: var(--emerald-reconciled); margin-top: 4px;">
            $${inv.receiptAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div style="font-size: 11px; color: var(--text-secondary); margin-top: 2px;">${inv.receiptNumber}</div>
        </div>
      `;
    }

    if (varianceBox) {
      if (inv.varianceAmount === 0) {
        varianceBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; color: var(--emerald-reconciled); font-weight: 800;">
            ${icons.checkCircle(20)}
            <span>0.00% Variance • 100% Exact 3-Way Match Verified</span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;">
            ${inv.auditNotes}
          </div>
        `;
      } else {
        varianceBox.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; color: var(--amber-variance); font-weight: 800;">
            ${icons.alertTriangle(20)}
            <span>Variance Detected: +$${inv.varianceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (${inv.variancePercent}%)</span>
          </div>
          <div style="font-size: 13px; color: var(--text-secondary); margin-top: 6px;">
            ${inv.auditNotes}
          </div>
        `;
      }
    }

    modal.style.display = 'flex';
  }

  handleInspectorApprove() {
    if (!this.activeInspectorInvoice) return;
    this.activeInspectorInvoice.status = 'Reconciled';
    this.activeInspectorInvoice.statusClass = 'badge-reconciled';
    this.activeInspectorInvoice.varianceAmount = 0.00;
    this.activeInspectorInvoice.variancePercent = 0.00;

    alert(`Invoice ${this.activeInspectorInvoice.id} approved and posted to ${this.activeInspectorInvoice.erpSyncTarget} General Ledger.`);

    const modal = document.getElementById('modal-inspector');
    if (modal) modal.style.display = 'none';

    this.renderInvoicesQueue();
  }

  handleInspectorOverride() {
    if (!this.activeInspectorInvoice) return;
    const reason = prompt("Enter CFO authorization override note:", "Price variance approved under quarterly volume rebate agreement.");
    if (reason) {
      this.activeInspectorInvoice.status = 'Reconciled';
      this.activeInspectorInvoice.statusClass = 'badge-reconciled';
      this.activeInspectorInvoice.auditNotes = `OVERRIDE APPROVED: ${reason}`;
      alert("Variance overridden with audit log entry.");
      const modal = document.getElementById('modal-inspector');
      if (modal) modal.style.display = 'none';
      this.renderInvoicesQueue();
    }
  }

  handleInspectorReject() {
    if (!this.activeInspectorInvoice) return;
    this.activeInspectorInvoice.status = 'Rejected';
    this.activeInspectorInvoice.statusClass = 'badge-duplicate';
    alert(`Invoice ${this.activeInspectorInvoice.id} rejected. Automated correction notice dispatched to vendor.`);
    const modal = document.getElementById('modal-inspector');
    if (modal) modal.style.display = 'none';
    this.renderInvoicesQueue();
  }

  // ====================================================================
  // ERP SYNC & EXPORTS
  // ====================================================================
  triggerErpSync() {
    alert("Live ERP Sync Triggered: 142 posted journal entries verified across SAP S/4HANA & NetSuite.");
  }

  exportGlCsv() {
    let csv = "Invoice ID,Vendor,Invoice Number,PO Number,Total Amount,GL Account Code,Status,ERP Target\n";
    this.data.invoices.forEach(inv => {
      csv += `"${inv.id}","${inv.vendor}","${inv.invoiceNumber}","${inv.poNumber}",${inv.totalAmount},"${inv.glCode}","${inv.status}","${inv.erpSyncTarget}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ProcureBot-GL-Entries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Global bootstrap
document.addEventListener('DOMContentLoaded', () => {
  window.procureApp = new ProcureBotApp();
  window.procureApp.init();
});
