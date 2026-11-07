/* ============================================================
   School Fee Management System — Frontend JS
   Author: Hemanth
   ============================================================ */

const API = '';  // same origin

/* ══════ DATE ══════ */
(function setDate() {
    const d = new Date();
    document.getElementById('topbarDate').textContent =
        d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long', year:'numeric' });
})();

/* ══════ SIDEBAR TOGGLE ══════ */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
}

/* ══════ SECTION NAVIGATION ══════ */
function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('sec-' + name).classList.add('active');
    document.querySelector(`[data-section="${name}"]`).classList.add('active');

    const titles = { dashboard:'Dashboard', students:'Students', fees:'Fee Assignment', payments:'Payments', reports:'Reports' };
    document.getElementById('pageTitle').textContent = titles[name] || name;
    document.getElementById('breadSub').textContent  = titles[name] || name;

    // Load data for section
    if (name === 'dashboard') loadDashboard();
    if (name === 'students')  loadStudents();
    if (name === 'fees')      loadFees();
    if (name === 'payments')  loadPayments();
    if (name === 'reports')   loadReports();

    // Close sidebar on mobile
    document.getElementById('sidebar').classList.remove('open');
}

/* ══════ TOAST ══════ */
function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => { t.classList.remove('show'); }, 3200);
}

/* ══════ MODAL ══════ */
function openModal(id) {
    document.getElementById(id).classList.add('open');
}
function closeModal(id) {
    document.getElementById(id).classList.remove('open');
    // Reset forms
    const form = document.querySelector(`#${id} form`);
    if (form) form.reset();
    // Clear hidden IDs
    const hid = document.querySelector(`#${id} input[type="hidden"]`);
    if (hid) hid.value = '';
}
// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeModal(overlay.id);
    });
});

/* ══════ ADMIN AVATAR ══════ */
const adminPhotoInput = document.getElementById('photoUpload');
if (adminPhotoInput) {
    adminPhotoInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = document.getElementById('adminAvatar');
            if (img) img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
    });
}
const adminAvatarEl = document.getElementById('adminAvatar');
if (adminAvatarEl) {
    adminAvatarEl.addEventListener('error', function() {
        this.style.display = 'none';
        const fallback = document.getElementById('avatarFallback');
        if (fallback) fallback.style.display = 'flex';
    });
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
async function loadDashboard() {
    try {
        const res  = await fetch(`${API}/api/reports/dashboard`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const d = json.data;

        document.getElementById('statStudents').textContent = d.total_students;
        document.getElementById('statFees').textContent     = '₹' + fmt(d.total_fees);
        document.getElementById('statPaid').textContent     = '₹' + fmt(d.total_paid);
        document.getElementById('statPending').textContent  = '₹' + fmt(d.pending);

        const pct = d.total_fees > 0 ? Math.round((d.total_paid / d.total_fees) * 100) : 0;
        document.getElementById('progressPct').textContent   = pct + '%';
        document.getElementById('progressBar').style.width   = pct + '%';

        // Recent payments table
        const tbody = document.getElementById('recentPaymentsTbody');
        if (!d.recent_payments.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading-row">No payments recorded yet.</td></tr>';
            return;
        }
        tbody.innerHTML = d.recent_payments.map(p => `
            <tr>
                <td>
                    <div class="student-cell">
                        <img src="${esc(p.student_photo || 'images/students/rahul.svg')}" class="student-cell-img" alt="${esc(p.student_name)}"/>
                        <strong>${esc(p.student_name)}</strong>
                    </div>
                </td>
                <td>${esc(p.fee_type)}</td>
                <td><strong>₹${fmt(p.amount_paid)}</strong></td>
                <td><span class="badge badge-paid">${esc(p.payment_method)}</span></td>
                <td>${formatDate(p.payment_date)}</td>
                <td><code>${esc(p.receipt_no)}</code></td>
            </tr>
        `).join('');
    } catch (err) {
        console.error('Dashboard load error:', err);
        showToast('Could not load dashboard data. Is the server running?', 'error');
    }
}

/* ══════════════════════════════════════
   STUDENTS
══════════════════════════════════════ */
let allStudents = [];

async function loadStudents() {
    try {
        const res  = await fetch(`${API}/api/students`);
        const json = await res.json();
        allStudents = json.data || [];
        renderStudents(allStudents);
    } catch { showToast('Could not load students', 'error'); }
}

function renderStudents(list) {
    const tbody = document.getElementById('studentsTbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading-row">No students found. Add one!</td></tr>';
        return;
    }
    tbody.innerHTML = list.map((s, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>
                <img src="${esc(s.photo || 'images/students/rahul.svg')}" class="student-avatar-img" alt="${esc(s.name)}" onerror="this.src='images/students/rahul.svg'"/>
            </td>
            <td><strong>${esc(s.name)}</strong></td>
            <td>${esc(s.class)}</td>
            <td><code>${esc(s.rollno)}</code></td>
            <td>${esc(s.phone || '—')}</td>
            <td>${esc(s.email || '—')}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editStudent(${s.student_id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent(${s.student_id}, '${esc(s.name)}')"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterStudents() {
    const q = document.getElementById('studentSearch').value.toLowerCase();
    renderStudents(allStudents.filter(s =>
        s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q) || s.rollno.toLowerCase().includes(q)
    ));
}

async function submitStudent(e) {
    e.preventDefault();
    const id = document.getElementById('studentId').value;
    const payload = {
        name:   document.getElementById('sName').value,
        class:  document.getElementById('sClass').value,
        rollno: document.getElementById('sRollno').value,
        phone:  document.getElementById('sPhone').value,
        email:  document.getElementById('sEmail').value,
        photo:  document.getElementById('sPhoto')?.value || 'images/students/rahul.svg'
    };
    try {
        const url    = id ? `${API}/api/students/${id}` : `${API}/api/students`;
        const method = id ? 'PUT' : 'POST';
        const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json   = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        closeModal('studentModal');
        loadStudents();
    } catch (err) { showToast(err.message, 'error'); }
}

async function editStudent(id) {
    const s = allStudents.find(s => s.student_id === id);
    if (!s) return;
    document.getElementById('studentModalTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Student';
    document.getElementById('studentId').value  = s.student_id;
    document.getElementById('sName').value      = s.name;
    document.getElementById('sClass').value     = s.class;
    document.getElementById('sRollno').value    = s.rollno;
    document.getElementById('sPhone').value     = s.phone || '';
    document.getElementById('sEmail').value     = s.email || '';
    if (document.getElementById('sPhoto')) {
        document.getElementById('sPhoto').value = s.photo || 'images/students/rahul.svg';
    }
    openModal('studentModal');
}

async function deleteStudent(id, name) {
    if (!confirm(`Delete student "${name}"? This will also delete their fees and payments.`)) return;
    try {
        const res  = await fetch(`${API}/api/students/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        loadStudents();
    } catch (err) { showToast(err.message, 'error'); }
}

/* ══════════════════════════════════════
   FEES
══════════════════════════════════════ */
let allFees = [];

async function loadFees() {
    try {
        const res  = await fetch(`${API}/api/fees`);
        const json = await res.json();
        allFees = json.data || [];
        renderFees(allFees);
        populateFeeStudentDropdown();
    } catch { showToast('Could not load fees', 'error'); }
}

function renderFees(list) {
    const tbody = document.getElementById('feesTbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="11" class="loading-row">No fee records found.</td></tr>';
        return;
    }
    tbody.innerHTML = list.map((f, i) => {
        const pending = parseFloat(f.pending_amount);
        const paid    = parseFloat(f.paid_amount);
        const total   = parseFloat(f.total_amount);
        let statusBadge = '';
        if (pending <= 0)       statusBadge = '<span class="badge badge-paid">Paid</span>';
        else if (paid > 0)      statusBadge = '<span class="badge badge-partial">Partial</span>';
        else                    statusBadge = '<span class="badge badge-pending">Pending</span>';

        return `<tr>
            <td>${i + 1}</td>
            <td>
                <div class="student-cell">
                    <img src="${esc(f.student_photo || 'images/students/rahul.svg')}" class="student-cell-img" alt="${esc(f.student_name)}"/>
                    <div class="student-meta">
                        <span class="student-meta-name">${esc(f.student_name)}</span>
                        <span class="student-meta-roll">${esc(f.rollno)}</span>
                    </div>
                </div>
            </td>
            <td>${esc(f.class)}</td>
            <td>${esc(f.academic_year)}</td>
            <td>${esc(f.fee_type)}</td>
            <td>₹${fmt(total)}</td>
            <td class="text-green">₹${fmt(paid)}</td>
            <td class="${pending > 0 ? 'text-red' : ''}">₹${fmt(pending)}</td>
            <td>${formatDate(f.due_date)}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-edit" onclick="editFee(${f.fee_id})"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" onclick="deleteFee(${f.fee_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>`;
    }).join('');
}

function filterFees() {
    const q = document.getElementById('feeSearch').value.toLowerCase();
    renderFees(allFees.filter(f =>
        (f.student_name||'').toLowerCase().includes(q) ||
        (f.fee_type||'').toLowerCase().includes(q) ||
        (f.academic_year||'').toLowerCase().includes(q)
    ));
}

async function populateFeeStudentDropdown() {
    const res  = await fetch(`${API}/api/students`);
    const json = await res.json();
    const sel  = document.getElementById('fStudentId');
    sel.innerHTML = '<option value="">Select student</option>' +
        (json.data||[]).map(s => `<option value="${s.student_id}">${esc(s.name)} (${esc(s.rollno)} - ${esc(s.class)})</option>`).join('');
}

async function submitFee(e) {
    e.preventDefault();
    const id = document.getElementById('feeId').value;
    const payload = {
        student_id:    document.getElementById('fStudentId').value,
        academic_year: document.getElementById('fAcademicYear').value,
        fee_type:      document.getElementById('fFeeType').value,
        total_amount:  document.getElementById('fAmount').value,
        due_date:      document.getElementById('fDueDate').value
    };
    try {
        const url    = id ? `${API}/api/fees/${id}` : `${API}/api/fees`;
        const method = id ? 'PUT' : 'POST';
        const res    = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json   = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        closeModal('feeModal');
        loadFees();
    } catch (err) { showToast(err.message, 'error'); }
}

function editFee(id) {
    const f = allFees.find(f => f.fee_id === id);
    if (!f) return;
    document.getElementById('feeId').value       = f.fee_id;
    document.getElementById('fStudentId').value  = f.student_id;
    document.getElementById('fAcademicYear').value = f.academic_year;
    document.getElementById('fFeeType').value    = f.fee_type;
    document.getElementById('fAmount').value     = f.total_amount;
    document.getElementById('fDueDate').value    = f.due_date ? f.due_date.split('T')[0] : '';
    openModal('feeModal');
}

async function deleteFee(id) {
    if (!confirm('Delete this fee record? All payments for it will also be removed.')) return;
    try {
        const res  = await fetch(`${API}/api/fees/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        loadFees();
    } catch (err) { showToast(err.message, 'error'); }
}

/* ══════════════════════════════════════
   PAYMENTS
══════════════════════════════════════ */
let allPayments = [];

async function loadPayments() {
    try {
        const res  = await fetch(`${API}/api/payments`);
        const json = await res.json();
        allPayments = json.data || [];
        renderPayments(allPayments);
        populatePaymentFeeDropdown();
    } catch { showToast('Could not load payments', 'error'); }
}

function renderPayments(list) {
    const tbody = document.getElementById('paymentsTbody');
    if (!list.length) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading-row">No payment records found.</td></tr>';
        return;
    }
    tbody.innerHTML = list.map((p, i) => `
        <tr>
            <td>${i + 1}</td>
            <td><code>${esc(p.receipt_no)}</code></td>
            <td>
                <div class="student-cell">
                    <img src="${esc(p.student_photo || 'images/students/rahul.svg')}" class="student-cell-img" alt="${esc(p.student_name)}"/>
                    <div class="student-meta">
                        <span class="student-meta-name">${esc(p.student_name)}</span>
                        <span class="student-meta-roll">${esc(p.rollno || '')}</span>
                    </div>
                </div>
            </td>
            <td>${esc(p.fee_type)}</td>
            <td><strong>₹${fmt(p.amount_paid)}</strong></td>
            <td><span class="badge badge-paid">${esc(p.payment_method)}</span></td>
            <td>${formatDate(p.payment_date)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deletePayment(${p.payment_id})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function filterPayments() {
    const q = document.getElementById('paymentSearch').value.toLowerCase();
    renderPayments(allPayments.filter(p =>
        (p.receipt_no||'').toLowerCase().includes(q) ||
        (p.student_name||'').toLowerCase().includes(q) ||
        (p.payment_method||'').toLowerCase().includes(q)
    ));
}

async function populatePaymentFeeDropdown() {
    const res  = await fetch(`${API}/api/fees`);
    const json = await res.json();
    const sel  = document.getElementById('pFeeId');
    // Only show fees with pending balance
    const pending = (json.data||[]).filter(f => parseFloat(f.pending_amount) > 0);
    sel.innerHTML = '<option value="">Select fee record</option>' +
        pending.map(f => `<option value="${f.fee_id}">${esc(f.student_name)} | ${esc(f.fee_type)} | ${esc(f.academic_year)} | Pending: ₹${fmt(f.pending_amount)}</option>`).join('');
    // Auto-generate receipt no
    const nextId = (json.data||[]).length + 1;
    document.getElementById('pReceiptNo').value = `RCP-${new Date().getFullYear()}-${String(nextId).padStart(3,'0')}`;
    // Set today's date
    document.getElementById('pDate').value = new Date().toISOString().split('T')[0];
}

async function submitPayment(e) {
    e.preventDefault();
    const payload = {
        fee_id:         document.getElementById('pFeeId').value,
        amount_paid:    document.getElementById('pAmount').value,
        payment_date:   document.getElementById('pDate').value,
        payment_method: document.getElementById('pMethod').value,
        receipt_no:     document.getElementById('pReceiptNo').value
    };
    try {
        const res  = await fetch(`${API}/api/payments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        closeModal('paymentModal');
        loadPayments();
    } catch (err) { showToast(err.message, 'error'); }
}

async function deletePayment(id) {
    if (!confirm('Delete this payment record?')) return;
    try {
        const res  = await fetch(`${API}/api/payments/${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        showToast(json.message);
        loadPayments();
    } catch (err) { showToast(err.message, 'error'); }
}

/* ══════════════════════════════════════
   REPORTS
══════════════════════════════════════ */
async function loadReports() {
    // Populate student dropdown
    const res  = await fetch(`${API}/api/students`);
    const json = await res.json();
    const sel  = document.getElementById('reportStudentSelect');
    sel.innerHTML = '<option value="">-- Select Student --</option>' +
        (json.data||[]).map(s => `<option value="${s.student_id}">${esc(s.name)} (${esc(s.rollno)})</option>`).join('');
    // Load pending
    loadPendingReport();
}

async function loadStudentReport() {
    const id = document.getElementById('reportStudentSelect').value;
    if (!id) { showToast('Please select a student', 'info'); return; }
    try {
        const res  = await fetch(`${API}/api/reports/student/${id}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.message);
        const { student, fees, payments, total_fees, total_paid, total_pending } = json.data;

        // Student card
        document.getElementById('reportStudentCard').innerHTML = `
            <div style="grid-column: 1 / -1;">
                <div class="report-profile-header">
                    <img src="${esc(student.photo || 'images/students/rahul.svg')}" class="report-student-lg-img" alt="${esc(student.name)}" onerror="this.src='images/students/rahul.svg'"/>
                    <div class="report-header-text">
                        <h3>${esc(student.name)}</h3>
                        <p>Class: ${esc(student.class)} | Roll No: ${esc(student.rollno)} | Contact: ${esc(student.phone || 'N/A')}</p>
                    </div>
                </div>
            </div>
            <div class="report-info-item"><label>Student Name</label><span>${esc(student.name)}</span></div>
            <div class="report-info-item"><label>Class</label><span>${esc(student.class)}</span></div>
            <div class="report-info-item"><label>Roll No</label><span>${esc(student.rollno)}</span></div>
            <div class="report-info-item"><label>Total Fees</label><span>₹${fmt(total_fees)}</span></div>
            <div class="report-info-item"><label>Total Paid</label><span>₹${fmt(total_paid)}</span></div>
            <div class="report-info-item"><label>Pending</label><span>₹${fmt(total_pending)}</span></div>
        `;

        // Fee table
        document.getElementById('reportFeeTable').innerHTML = `
            <div class="report-section-title"><i class="fas fa-file-invoice-dollar"></i> Fee Records</div>
            <div class="table-wrap">
            <table class="data-table">
                <thead><tr><th>Fee Type</th><th>Academic Year</th><th>Total</th><th>Paid</th><th>Pending</th><th>Due Date</th><th>Status</th></tr></thead>
                <tbody>${fees.map(f => {
                    const pend = parseFloat(f.pending_amount);
                    const paid = parseFloat(f.paid_amount);
                    let badge = pend <= 0 ? '<span class="badge badge-paid">Paid</span>' : paid > 0 ? '<span class="badge badge-partial">Partial</span>' : '<span class="badge badge-pending">Pending</span>';
                    return `<tr>
                        <td>${esc(f.fee_type)}</td>
                        <td>${esc(f.academic_year)}</td>
                        <td>₹${fmt(f.total_amount)}</td>
                        <td>₹${fmt(f.paid_amount)}</td>
                        <td>₹${fmt(f.pending_amount)}</td>
                        <td>${formatDate(f.due_date)}</td>
                        <td>${badge}</td>
                    </tr>`;
                }).join('')}</tbody>
            </table></div>`;

        // Payment table
        document.getElementById('reportPaymentTable').innerHTML = `
            <div class="report-section-title"><i class="fas fa-money-bill-wave"></i> Payment History</div>
            <div class="table-wrap">
            <table class="data-table">
                <thead><tr><th>Receipt No</th><th>Fee Type</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
                <tbody>${payments.length ? payments.map(p => `
                    <tr>
                        <td><code>${esc(p.receipt_no)}</code></td>
                        <td>${esc(p.fee_type)}</td>
                        <td><strong>₹${fmt(p.amount_paid)}</strong></td>
                        <td>${esc(p.payment_method)}</td>
                        <td>${formatDate(p.payment_date)}</td>
                    </tr>`).join('') : '<tr><td colspan="5" class="loading-row">No payments yet.</td></tr>'}
                </tbody>
            </table></div>`;

        document.getElementById('studentReportResult').style.display = 'block';
    } catch (err) { showToast(err.message, 'error'); }
}

async function loadPendingReport() {
    try {
        const res  = await fetch(`${API}/api/reports/pending`);
        const json = await res.json();
        const rows = json.data || [];
        const tbody = document.getElementById('pendingTbody');
        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="9" class="loading-row">🎉 No pending payments! All fees are cleared.</td></tr>';
            return;
        }
        tbody.innerHTML = rows.map(r => `
            <tr>
                <td>
                    <div class="student-cell">
                        <img src="${esc(r.student_photo || 'images/students/rahul.svg')}" class="student-cell-img" alt="${esc(r.name)}"/>
                        <strong>${esc(r.name)}</strong>
                    </div>
                </td>
                <td>${esc(r.class)}</td>
                <td>${esc(r.rollno)}</td>
                <td>${esc(r.fee_type)}</td>
                <td>${esc(r.academic_year)}</td>
                <td>₹${fmt(r.total_amount)}</td>
                <td>₹${fmt(r.paid_amount)}</td>
                <td><strong style="color:var(--red-500)">₹${fmt(r.pending_amount)}</strong></td>
                <td>${formatDate(r.due_date)}</td>
            </tr>
        `).join('');
    } catch { showToast('Could not load pending report', 'error'); }
}

/* ══════ UTILS ══════ */
function fmt(n) {
    return parseFloat(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function formatDate(d) {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

/* ══════ INIT ══════ */
loadDashboard();
