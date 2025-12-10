# בדיקת Variables - מה יש ומה חסר

## ✅ Web Service Variables - מה יש

מהתמונה אני רואה שיש:
- ✅ `NEXT_PUBLIC_API_URL` (מופיע פעמיים - כדאי לבדוק)
- ✅ `NEXT_PUBLIC_BRAND_NAME`
- ✅ `NEXT_PUBLIC_DEMO_MODE`
- ✅ `NEXT_PUBLIC_PRIMARY_COLOR`
- ✅ `NODE_ENV`
- ✅ `PORT`

## ❌ Web Service Variables - מה חסר

- ❌ `NEXT_PUBLIC_TENANT_ID` = `furniture-demo` - **חסר!**

---

## ✅ API Service Variables - מה יש

מהתמונה אני רואה שיש:
- ✅ `JWT_SECRET`
- ✅ `DATABASE_URL`
- ✅ `DEMO_MODE`
- ✅ `FRONTEND_URL`
- ✅ `PORT`
- ✅ `REDIS_URL`
- ⚠️ `furniture` - זה נראה מוזר, אולי variable לא נכון?

---

## 🔧 מה צריך לעשות

### 1. Web Service - הוסף Variable חסר

**Dashboard → `@furniture/web` → Variables:**

1. לחץ **"+ New Variable"**
2. **Name:** `NEXT_PUBLIC_TENANT_ID`
3. **Value:** `furniture-demo`
4. **שמור**

---

### 2. Web Service - בדוק NEXT_PUBLIC_API_URL

אם `NEXT_PUBLIC_API_URL` מופיע פעמיים:
1. **מחק אחד מהם** (לחץ על ה-3 נקודות → Delete)
2. **וודא שהערך נכון:** `https://<api-url>.railway.app/api`

---

### 3. API Service - בדוק Variable `furniture`

אם יש variable בשם `furniture`:
1. **לחץ על ה-3 נקודות** → **Delete**
2. זה לא variable נדרש

---

## ✅ Checklist סופי

### Web Service Variables
- [x] `NEXT_PUBLIC_API_URL`
- [x] `NEXT_PUBLIC_BRAND_NAME`
- [x] `NEXT_PUBLIC_DEMO_MODE`
- [x] `NEXT_PUBLIC_PRIMARY_COLOR`
- [x] `NODE_ENV`
- [x] `PORT`
- [ ] `NEXT_PUBLIC_TENANT_ID` - **צריך להוסיף!**

### API Service Variables
- [x] `JWT_SECRET`
- [x] `DATABASE_URL`
- [x] `DEMO_MODE`
- [x] `FRONTEND_URL`
- [x] `PORT`
- [x] `REDIS_URL`

---

## 🚀 אחרי התיקון

1. **הוסף `NEXT_PUBLIC_TENANT_ID`** ב-Web Service
2. **תקן/מחק** `NEXT_PUBLIC_API_URL` כפול (אם יש)
3. **מחק** variable `furniture` ב-API Service (אם יש)
4. **Redeploy Web Service**

---

**זה אמור לפתור את בעיית ה-Build!**

