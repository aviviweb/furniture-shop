export function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (typeof window === 'undefined') {
    console.log(`[Toast] ${message}`);
    return;
  }
  const root = document.getElementById('toast-root');
  if (!root) {
    console.warn('Toast root not found, message:', message);
    return;
  }
  const el = document.createElement('div');
  el.textContent = message;
  el.style.padding = '10px 12px';
  el.style.border = type === 'error' ? '1px solid #fca5a5' : '1px solid #e5e7eb';
  el.style.borderRadius = '10px';
  el.style.background = type === 'error' ? '#fee2e2' : '#fff';
  el.style.color = type === 'error' ? '#991b1b' : '#0f172a';
  el.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)';
  el.style.direction = 'rtl';
  el.style.textAlign = 'right';
  el.style.fontSize = '14px';
  el.style.maxWidth = '400px';
  root.appendChild(el);
  setTimeout(()=> el.remove(), type === 'error' ? 5000 : 2200);
}


