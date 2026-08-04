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
