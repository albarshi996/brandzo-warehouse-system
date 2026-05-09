/**
 * Brandzo Smart Forms Utility (SAFE VERSION)
 * Handles localStorage persistence, barcode scanning, print optimization, and dynamic rows.
 */

(function () {
  const FORM_ID = window.location.pathname;

  // 1. Initialize logic when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    loadDraft();
    setupEventListeners();
    setupAutoFill();
    injectLandscapePrint();
    setupPrintValidation();
    setupDynamicRows();
  });

  // 2. Setup Event Listeners
  function setupEventListeners() {
    document.addEventListener('input', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        saveDraft();
        syncToPrint(e.target);
        handleAutoCalculation(e.target);
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.closest('table')) {
        saveDraft();
      }
    });
  }

  // 3. Save to localStorage
  function saveDraft() {
    const formData = {};
    const inputs = document.querySelectorAll('input, textarea');

    inputs.forEach((input, index) => {
      if (input.id || input.name) {
        formData[input.id || input.name] = input.value;
      } else {
        formData[`input_index_${index}`] = input.value;
      }
    });

    formData.tables = getTableData();
    localStorage.setItem(`brandzo_draft_${FORM_ID}`, JSON.stringify(formData));
  }

  // 4. Load from localStorage
  function loadDraft() {
    const saved = localStorage.getItem(`brandzo_draft_${FORM_ID}`);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      const inputs = document.querySelectorAll('input, textarea');

      Object.keys(data).forEach(key => {
        if (key === 'tables') {
          restoreTableData(data.tables);
        } else if (key.startsWith('input_index_')) {
          const index = parseInt(key.replace('input_index_', ''));
          const el = inputs[index];
          if (el) {
            el.value = data[key];
            syncToPrint(el);
          }
        } else {
          const el = document.getElementById(key) || document.querySelector(`[name="${key}"]`);
          if (el) {
            el.value = data[key];
            syncToPrint(el);
          }
        }
      });
    } catch (e) {
      console.error('Failed to load draft:', e);
    }
  }

  // 5. Table Data Mapping
  function getTableData() {
    const tableData = [];
    const tables = document.querySelectorAll('table');

    tables.forEach((table, tIndex) => {
      const rows = [];
      const trs = table.querySelectorAll('tbody tr');
      trs.forEach((tr, rIndex) => {
        const rowData = {};
        const inputs = tr.querySelectorAll('input');
        inputs.forEach((input, i) => {
          rowData[`col_${i}`] = input.value;
        });
        if (Object.keys(rowData).length > 0) {
          rows.push({ rowIndex: rIndex, data: rowData });
        }
      });
      if (rows.length > 0) {
        tableData.push({ tableIndex: tIndex, rows: rows });
      }
    });
    return tableData;
  }

  function restoreTableData(tableData) {
    const tables = document.querySelectorAll('table');
    tableData.forEach(tData => {
      const table = tables[tData.tableIndex];
      if (!table) return;

      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const currentRowsCount = tbody.querySelectorAll('tr').length;
      const targetRowsCount = tData.rows.length;

      // [تم الإصلاح هنا] إضافة الصفوف المفقودة باستخدام for loop وزر أمان لمنع التعليق
      if (targetRowsCount > currentRowsCount) {
        const rowsToAdd = targetRowsCount - currentRowsCount;
        for (let i = 0; i < rowsToAdd; i++) {
          const added = addNewRow(table);
          if (!added) break; // خروج طوارئ إذا فشلت الإضافة
        }
      }

      const trs = tbody.querySelectorAll('tr');
      tData.rows.forEach(rData => {
        const tr = trs[rData.rowIndex];
        if (tr) {
          const inputs = tr.querySelectorAll('input');
          Object.keys(rData.data).forEach(key => {
            const colIndex = parseInt(key.replace('col_', ''));
            if (inputs[colIndex]) {
              inputs[colIndex].value = rData.data[key];
              syncToPrint(inputs[colIndex]);
            }
          });
        }
      });
    });
  }

  // 6. Print Persistence & Sync
  function syncToPrint(el) {
    el.setAttribute('value', el.value);
    const parent = el.parentElement;
    if (parent && (parent.tagName === 'TD' || parent.classList.contains('print-sync'))) {
      let printSpan = parent.querySelector('.print-only-text');
      if (!printSpan) {
        printSpan = document.createElement('span');
        printSpan.className = 'print-only-text hidden print:block';
        parent.appendChild(printSpan);
      }
      printSpan.innerText = el.value;
    }
  }

  // 7. Auto-calculation
  function handleAutoCalculation(target) {
    if (target.classList.contains('item-qty') || target.classList.contains('item-price')) {
      const row = target.closest('tr');
      if (!row) return;

      const qtyInput = row.querySelector('.item-qty');
      const priceInput = row.querySelector('.item-price');
      const totalInput = row.querySelector('.item-total');

      if (qtyInput && priceInput && totalInput) {
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = qty * price;
        totalInput.value = total.toFixed(2);
        syncToPrint(totalInput);
      }
    }
  }

  // 8. Dynamic Rows Feature 
  function setupDynamicRows() {
    document.querySelectorAll('table').forEach(function (table) {
      const tbody = table.querySelector('tbody');
      if (!tbody) return;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = '+ إضافة صف';
      btn.className = 'no-print';
      btn.style.cssText = 'margin:6px 0; padding:5px 14px; background:#e65c00; color:#fff; border:none; border-radius:4px; cursor:pointer; font-size:13px; font-family:inherit;';

      btn.addEventListener('click', function () {
        addNewRow(table);
        saveDraft(); // حفظ المسودة فوراً لتسجيل الصف الجديد
      });

      table.parentNode.insertBefore(btn, table.nextSibling);
    });
  }

  function addNewRow(table) {
    const tbody = table.querySelector('tbody');
    if (!tbody) return false;
    
    const lastRow = tbody.querySelector('tr:last-child');
    if (!lastRow) return false; // [تم الإصلاح هنا] التحقق من وجود صف أساسي لنسخه

    const newRow = lastRow.cloneNode(true);
    const rowIndex = tbody.querySelectorAll('tr').length + 1;

    newRow.querySelectorAll('input, textarea, select').forEach(function (el) {
      if (el.type === 'number') el.value = '';
      else if (el.tagName === 'SELECT') el.selectedIndex = 0;
      else el.value = '';
      el.removeAttribute('value');
      
      // [تم الإصلاح هنا] مسح أي نصوص طباعة قديمة تم نسخها بالخطأ مع الصف
      const parent = el.parentElement;
      if (parent) {
         const oldSpan = parent.querySelector('.print-only-text');
         if (oldSpan) oldSpan.remove();
      }
    });

    const firstTd = newRow.querySelector('td:first-child');
    if (firstTd && !firstTd.querySelector('input') && /^\d+$/.test(firstTd.textContent.trim())) {
      firstTd.textContent = rowIndex;
    }

    tbody.appendChild(newRow);
    return true; // تمت الإضافة بنجاح
  }

  // 9. Extra Utils
  function setupPrintValidation() { /* إلغاء القيود */ }

  function setupAutoFill() {
    const dateInput = document.querySelector('input[type="date"]');
    if (dateInput && !dateInput.value) {
      dateInput.value = new Date().toISOString().split('T')[0];
      syncToPrint(dateInput);
    }
  }

  function injectLandscapePrint() {
    if (document.getElementById('brandzo-landscape-print')) return;
    const style = document.createElement('style');
    style.id = 'brandzo-landscape-print';
    style.textContent = '@page { size: A4 landscape; margin: 10mm; } @media print { .no-print { display: none !important; } }';
    document.head.appendChild(style);
  }

})();
