export function downloadJSON(filename: string, data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}

export function uploadJSON(onLoad: (obj: any)=>void) {
  const input = document.createElement('input'); input.type = 'file'; input.accept = 'application/json';
  input.onchange = () => {
    const file = input.files?.[0]; if (!file) return;
    const reader = new FileReader(); reader.onload = () => {
      try { const obj = JSON.parse(String(reader.result||'')); onLoad(obj); } catch {}
    }; reader.readAsText(file);
  };
  input.click();
}


