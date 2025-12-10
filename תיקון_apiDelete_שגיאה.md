# 🔧 תיקון שגיאת apiDelete

## 🔴 הבעיה:

```
Type error: Module '"../../../lib/api"' has no exported member 'apiDelete'.
```

**הפונקציה `apiDelete` קיימת בקוד המקומי, אבל לא ב-GitHub/Railway!**

---

## ✅ הפתרון:

### שלב 1: ודא שהקוד נדחף ל-GitHub

**הקוד המקומי שונה מהקוד ב-GitHub. צריך לדחוף את השינויים:**

1. **פתח Terminal** (PowerShell)
2. **הרץ:**
   ```powershell
   git add apps/web/lib/api.ts
   git commit -m "Add apiDelete function export"
   git push
   ```

3. **חכה** ש-Railway יבצע auto-deploy (אם GitHub מחובר)

---

### שלב 2: אם זה לא עובד - בדוק את הקוד

**פתח `apps/web/lib/api.ts`** → **וודא שיש:**

```typescript
export async function apiDelete<T>(path: string, tenantId?: string): Promise<T> {
  try {
    const tid = tenantId || getTenantIdForApi();
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json', 
        'x-tenant-id': tid 
      },
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API DELETE error:', errorText);
      throw new Error(`שגיאת API: ${res.status}`);
    }
    // DELETE might return empty body
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return res.json();
    }
    return {} as T;
  } catch (error) {
    console.error('API DELETE failed:', error);
    throw error;
  }
}
```

**אם זה לא קיים** → הוסף את זה בסוף הקובץ (לפני השורה האחרונה).

---

### שלב 3: דחוף ל-GitHub

```powershell
git add .
git commit -m "Fix: Add apiDelete export to api.ts"
git push
```

---

### שלב 4: Redeploy ב-Railway

1. **Dashboard** → **`@furniture/web`** → **Deployments**
2. **לחץ "Redeploy"** (או חכה ל-auto-deploy)
3. **בדוק את ה-Logs** → וודא שהבילד עובר

---

## 💡 אם עדיין לא עובד:

**נסה לנקות את ה-Cache:**

1. **Dashboard** → **`@furniture/web`** → **Settings** → **Build**
2. **חפש "Clear Build Cache"** או **"Rebuild"**
3. **לחץ על זה**
4. **Redeploy**

---

## ✅ Checklist:

- [ ] `apiDelete` קיים ב-`apps/web/lib/api.ts`
- [ ] הקוד נדחף ל-GitHub (`git push`)
- [ ] Railway מבצע auto-deploy (או Redeploy ידנית)
- [ ] Build עובר בהצלחה

---

**הכי פשוט: דחוף את הקוד ל-GitHub → Railway יעשה auto-deploy!**

