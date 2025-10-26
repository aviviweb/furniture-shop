export function downloadCSV(filename: string, rows: Array<Record<string, any>>) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (val: any) => {
    if (val === null || val === undefined) return '';
    const s = String(val).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = [headers.join(',')].concat(
    rows.map(r => headers.map(h => escape(r[h])).join(','))
  ).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

export function uploadCSV(onLoad: (rows: Record<string, string>[])=>void) {
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.csv,text/csv';
  input.onchange = () => {
    const file = input.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => {
      const text = String(reader.result||'');
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (lines.length === 0) return;
      const headers = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(line => {
        const cols = line.split(',');
        const obj: Record<string,string> = {};
        headers.forEach((h, i)=> obj[h] = (cols[i]||'').replace(/^"|"$/g,''));
        return obj;
      });
      onLoad(rows);
    }; reader.readAsText(file);
  };
  input.click();
}


