# 🔧 תיקון שגיאת ENOTFOUND

## 🔍 הבעיה:

שגיאת `ENOTFOUND` אומרת שהאפליקציה לא מצליחה להתחבר ל-Database או ל-Redis.

**זה יכול להיות:**
1. `DATABASE_URL` לא נכון או לא מוגדר
2. `REDIS_URL` לא נכון או לא מוגדר
3. ה-Services (PostgreSQL/Redis) לא עובדים
4. בעיית רשת/DNS

---

## ✅ פתרון:

### שלב 1: וודא ש-PostgreSQL ו-Redis עובדים

**Railway Dashboard:**
1. **PostgreSQL Service** → **"Logs"**
2. **חפש:** `database system is ready to accept connections`
3. **אם אתה רואה את זה** → PostgreSQL עובד! ✅

4. **Redis Service** → **"Logs"**
5. **חפש:** הודעות הצלחה
6. **אם אתה רואה הודעות** → Redis עובד! ✅

---

### שלב 2: וודא ש-DATABASE_URL נכון

**Railway Dashboard:**

1. **PostgreSQL Service** → **"Variables"** → **העתק `DATABASE_URL`**
2. **API Service** → **"Variables"** → **חפש `DATABASE_URL`**
3. **אם אין** → **"+ New Variable"** → **Name: `DATABASE_URL`** → **Value: הדבק מה-PostgreSQL**
4. **אם יש** → **ערוך** → **וודא שזה זהה ל-PostgreSQL**
5. **שמור**

---

### שלב 3: וודא ש-REDIS_URL נכון

**Railway Dashboard:**

1. **Redis Service** → **"Variables"** → **העתק `REDIS_URL`** (או `REDISCLOUD_URL`)
2. **API Service** → **"Variables"** → **חפש `REDIS_URL`**
3. **אם אין** → **"+ New Variable"** → **Name: `REDIS_URL`** → **Value: הדבק מה-Redis**
4. **אם יש** → **ערוך** → **וודא שזה נכון**
5. **שמור**

---

### שלב 4: Redeploy API Service

**דרך Dashboard:**

1. **API Service** → **"Deployments"** → **"Redeploy"**
2. **בחר `main`** → **"Deploy"**
3. **חכה 3-5 דקות**

**דרך CLI:**

```powershell
pnpm deploy:api
```

---

### שלב 5: בדוק Logs

```powershell
pnpm railway:logs:api
```

**חפש:**
- ✅ `✅ API running on port 4000, Demo Mode: false`
- ❌ אם יש שגיאות → העתק אותן

---

## 🆘 אם עדיין לא עובד:

### בדוק את ה-Logs ב-Railway Dashboard:

1. **API Service** → **"Logs"**
2. **חפש שגיאות** → **העתק את השגיאה האחרונה**
3. **שלח לי** → אעזור לך לתקן

### שגיאות נפוצות:

**"Can't reach database server"**
→ `DATABASE_URL` לא נכון או PostgreSQL לא עובד

**"ENOTFOUND"**
→ בעיית DNS או URL לא נכון

**"Connection refused"**
→ Service לא עובד או Port לא נכון

---

## 📋 Checklist:

- [ ] PostgreSQL Service עובד (Online)
- [ ] Redis Service עובד (Online)
- [ ] `DATABASE_URL` זהה ב-PostgreSQL ו-API Services
- [ ] `REDIS_URL` מוגדר ב-API Service
- [ ] ביצעתי Redeploy
- [ ] בדקתי Logs - אמור לעבוד

---

**התחל עם וידוא ש-PostgreSQL ו-Redis עובדים!** 🔍

