export type TransactionReportRow = {
  id: number;
  customerName: string;
  fieldName: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: number;
  dp_amount: number;
  status: string;
};

const money = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

export function currentMonthRange(now = new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
  return { from: `${year}-${month}-01`, to: `${year}-${month}-${String(lastDay).padStart(2, '0')}` };
}

export function selectTransactionReportRows(rows: TransactionReportRow[], status: string, from: string, to: string) {
  return rows.filter((row) => (!status || row.status === status) && (!from || row.booking_date >= from) && (!to || row.booking_date <= to));
}

export function transactionReportHtml(rows: TransactionReportRow[], from: string, to: string, status: string, logoUrl: string) {
  const escape = (value: string) => value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
  const total = rows.reduce((sum, row) => sum + row.price, 0);
  const paid = rows.reduce((sum, row) => sum + row.dp_amount, 0);
  const balance = total - paid;
  const period = `${from || 'Awal'} s.d. ${to || 'Sekarang'}`;

  return `<!doctype html><html lang="id"><head><title>Ringkasan Transaksi HAM Stadium</title><style>body{font-family:Arial,sans-serif;color:#172033;margin:32px}header{display:flex;align-items:center;justify-content:space-between;gap:24px;border-bottom:3px solid #172033;margin-bottom:22px;padding-bottom:14px}.eyebrow{color:#667085;font-size:10px;font-weight:700;letter-spacing:.12em;margin:0 0 5px;text-transform:uppercase}h1{font-size:25px;letter-spacing:-.04em;margin:0 0 6px}p{margin:0;color:#4b5563;font-size:12px}.logo{display:block;max-height:58px;max-width:150px;object-fit:contain}.summary{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #d8dee9;margin:18px 0 22px}.summary div{border-right:1px solid #d8dee9;font-size:11px;padding:12px 14px}.summary div:last-child{border:0}.summary strong{display:block;font-size:16px;color:#172033;margin-top:4px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #d8dee9;padding:8px;text-align:left;vertical-align:top}th{background:#172033;color:#fff;font-size:9px;letter-spacing:.04em;text-transform:uppercase}tr:nth-child(even){background:#f8fafc}td.amount{text-align:right;white-space:nowrap}@media print{body{margin:16px}@page{size:A4 landscape;margin:12mm}}</style></head><body><header><div><p class="eyebrow">HAM Stadium Booking</p><h1>Ringkasan Transaksi</h1><p>Periode ${escape(period)} · Status ${escape(status || 'Semua')}</p></div><img class="logo" src="${escape(logoUrl)}" alt="HAM Stadium"></header><div class="summary"><div>Jumlah transaksi<strong>${rows.length}</strong></div><div>Total tagihan<strong>${money.format(total)}</strong></div><div>DP tercatat<strong>${money.format(paid)}</strong></div><div>Sisa tagihan<strong>${money.format(balance)}</strong></div></div><table><thead><tr><th>ID</th><th>Customer</th><th>Lapangan</th><th>Jadwal</th><th>Status</th><th>Total</th><th>DP</th><th>Sisa</th></tr></thead><tbody>${rows.map((row) => `<tr><td>#${row.id}</td><td>${escape(row.customerName || '-')}</td><td>${escape(row.fieldName || '-')}</td><td>${escape(row.booking_date)}<br>${escape(row.start_time.slice(0, 5))}-${escape(row.end_time.slice(0, 5))}</td><td>${escape(row.status)}</td><td class="amount">${money.format(row.price)}</td><td class="amount">${money.format(row.dp_amount)}</td><td class="amount">${money.format(Math.max(0, row.price - row.dp_amount))}</td></tr>`).join('')}</tbody></table></body></html>`;
}
