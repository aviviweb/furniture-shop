<!-- 67992c6f-d469-4c74-bcc6-30eedf025b6a ea9c3567-8d14-4174-a86c-3606e44d647f -->
# תיקון שגיאות undefined includes

## בעיה

בדפי החשבוניות, הזמנות ומוצרים יש שגיאות runtime כאשר `id` או `customer`/`name` הם undefined והקוד מנסה לקרוא ל-`.includes()` עליהם.

## תיקון

### 1. תיקון invoices/page.tsx

בקובץ `apps/web/app/(dashboard)/invoices/page.tsx` שורה 37:

- הוסף בדיקות בטיחות: `(i.id || '').includes(q)` ו-`(i.customer || '').includes(q)`

### 2. תיקון orders/page.tsx

בקובץ `apps/web/app/(dashboard)/orders/page.tsx` שורה 27:

- הוסף בדיקות בטיחות: `(o.id || '').includes(q)` ו-`(o.customer || '').includes(q)`

### 3. תיקון products/page.tsx

בקובץ `apps/web/app/(dashboard)/products/page.tsx` שורה 35:

- הוסף בדיקות בטיחות: `(p.name || '').includes(q)` ו-`(p.id || '').includes(q)`

### 4. בדיקה

- רענן את הדפדפן ובדוק שדף החשבוניות נטען ללא שגיאות
- בדוק גם את דפי ההזמנות והמוצרים

### To-dos

- [ ] מחק ClientShell כפול מ-layout.tsx ותקן toast positioning ל-RTL
- [ ] שפר את globals.css עם כללי RTL נוספים
- [ ] תרגם את כל הטקסטים באנגלית לעברית (Navigation, כפתורים, תוויות)
- [ ] הוסף נתוני דמו נוספים (מוצרים, לקוחות, חשבוניות)
- [ ] בדוק ותקן את כל ה-import paths בפרויקט
- [ ] בדוק שכל הדפים נטענים ללא שגיאות
- [ ] תקן את demo:up script ב-package.json
- [ ] הוסף loading states, error handling, ו-empty states
- [ ] עדכן README.md וצור DEMO_GUIDE.md