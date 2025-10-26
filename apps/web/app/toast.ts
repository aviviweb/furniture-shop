export function showToast(message: string) {
  if (typeof window === 'undefined') return;
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.textContent = message;
  el.style.padding = '10px 12px';
  el.style.border = '1px solid #e5e7eb';
  el.style.borderRadius = '10px';
  el.style.background = '#fff';
  el.style.boxShadow = '0 8px 24px rgba(0,0,0,.08)';
  root.appendChild(el);
  setTimeout(()=> el.remove(), 2200);
}


