import * as XLSX from 'xlsx'

export function downloadCSV(
  filename: string,
  headers: string[],
  rows: (string | number | null | undefined)[][]
) {
  // Prepend UTF-8 BOM byte (\uFEFF) so Excel opens UTF-8 Indonesian text & IDR currency correctly
  let csvContent = '\uFEFF'

  // Header line
  csvContent += headers.map((h) => `"${h.replace(/"/g, '""')}"`).join(',') + '\r\n'

  // Data rows
  rows.forEach((row) => {
    const formattedRow = row.map((cell) => {
      if (cell == null) return '""'
      const str = String(cell).replace(/"/g, '""')
      return `"${str}"`
    })
    csvContent += formattedRow.join(',') + '\r\n'
  })

  // Trigger browser download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function downloadExcel(
  filename: string,
  sheetName: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
  summaryCards?: SummaryCardItem[]
) {
  const wb = XLSX.utils.book_new()
  const data: any[][] = []

  if (summaryCards && summaryCards.length > 0) {
    summaryCards.forEach((card) => {
      data.push([card.label, card.value])
    })
    data.push([]) // Baris kosong pemisah
  }

  data.push(headers)
  rows.forEach((r) => data.push(r.map((c) => c ?? '')))

  const ws = XLSX.utils.aoa_to_sheet(data)

  // Auto-fit width kolom
  const colWidths = headers.map((h, colIdx) => {
    let maxLen = h.length
    rows.forEach((r) => {
      const cellVal = String(r[colIdx] ?? '')
      if (cellVal.length > maxLen) maxLen = cellVal.length
    })
    return { wch: Math.min(Math.max(maxLen + 4, 12), 45) }
  })
  ws['!cols'] = colWidths

  XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 30))
  XLSX.writeFile(wb, filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`)
}

export interface SummaryCardItem {
  label: string
  value: string | number
}

export function printPDFReport(
  title: string,
  subtitle: string,
  headers: string[],
  rows: (string | number | null | undefined)[][],
  summaryCards?: SummaryCardItem[]
) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const cardsHtml = summaryCards
    ? `<div style="display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap;">
        ${summaryCards
          .map(
            (c) => `
          <div style="flex: 1; min-width: 140px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px;">
            <div style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">${c.label}</div>
            <div style="font-size: 18px; font-weight: 700; color: #0f172a;">${c.value}</div>
          </div>
        `
          )
          .join('')}
      </div>`
    : ''

  const tableHeadersHtml = headers
    .map(
      (h) =>
        `<th style="padding: 10px 12px; background: #f1f5f9; color: #334155; font-size: 12px; text-align: left; font-weight: 600; border-bottom: 2px solid #cbd5e1;">${h}</th>`
    )
    .join('')

  const tableRowsHtml = rows
    .map(
      (row, idx) => `
      <tr style="background: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; font-size: 12px; color: #1e293b;">
        ${row
          .map(
            (cell) =>
              `<td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0;">${cell ?? '-'}</td>`
          )
          .join('')}
      </tr>
    `
    )
    .join('')

  const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>${title} — Reachly Report</title>
      <style>
        @page { size: A4 landscape; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 24px; color: #0f172a; background: #fff; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #6366f1; padding-bottom: 16px; margin-bottom: 24px; }
        .logo { font-size: 22px; font-weight: 800; color: #6366f1; letter-spacing: -0.5px; }
        .logo span { color: #0f172a; }
        .report-title { font-size: 20px; font-weight: 700; color: #0f172a; margin-top: 4px; }
        .report-subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
        .meta-date { font-size: 12px; color: #64748b; font-weight: 500; }
        table { width: 100%; border-collapse: collapse; margin-top: 8px; }
        .footer { margin-top: 32px; font-size: 11px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="logo">Reach<span>ly</span></div>
          <div class="report-title">${title}</div>
          <div class="report-subtitle">${subtitle}</div>
        </div>
        <div class="meta-date">Dicetak pada: ${currentDate}</div>
      </div>

      ${cardsHtml}

      <table>
        <thead>
          <tr>${tableHeadersHtml}</tr>
        </thead>
        <tbody>
          ${tableRowsHtml}
        </tbody>
      </table>

      <div class="footer">
        Reachly — Platform Manajemen Kerja Sama Influencer/KOL • Laporan ini dibuat secara otomatis
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `

  printWindow.document.write(html)
  printWindow.document.close()
}
