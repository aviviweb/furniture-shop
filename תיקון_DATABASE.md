# 🗄️ תיקון: Can't reach database server

## ❌ השגיאה שאתה רואה:
```
PrismaClientInitializationError: Can't reach database server at ...:5432
errorCode: 'P1001'
```

**זה אומר:** ה-API לא יכול להתחבר ל-PostgreSQL.

---

## ✅ פתרון 1: וודא שיש PostgreSQL Service (הכי חשוב!)

### בדיקה:
1. **ב-Railway Dashboard** → **חזור לרשימת Services** (לחץ על שם הפרויקט למעלה)
2. **חפש Service בשם "Postgres"** או "PostgreSQL"
3. **אם אין** → צריך ליצור!

### יצירת PostgreSQL:
1. **לחץ "New"** (למעלה מימין)
2. **בחר "Database"**
3. **בחר "PostgreSQL"**
4. **חכה 30 שניות** - Railway ייצור את ה-Database
5. **`DATABASE_URL` יתווסף אוטומטית** לכל ה-Services!

---

## ✅ פתרון 2: אם יש PostgreSQL אבל עדיין לא עובד

### בדיקה:
1. **API Service** → **"Variables"** (משמאל)
2. **חפש `DATABASE_URL`**
3. **אם אין** → צריך להוסיף ידנית

### הוספה ידנית:
1. **PostgreSQL Service** → **"Variables"**
2. **חפש `DATABASE_URL`** - העתק אותו
3. **API Service** → **"Variables"** → **"+ New Variable"**
4. **שם:** `DATABASE_URL`
5. **ערך:** הדבק את ה-URL שהעתקת
6. **שמור**

---

## ✅ פתרון 3: אם אתה ב-DEMO_MODE

**אם אתה רוצה להריץ בלי Database (רק לבדיקה):**

1. **API Service** → **"Variables"**
2. **הוסף/תקן:**
   ```
   DEMO_MODE = true
   ```
3. **שמור** → **Restart**

**⚠️ זה רק לבדיקה! לא ל-production!**

---

## 📋 סדר פעולות מומלץ:

1. ✅ **בדוק אם יש PostgreSQL Service** (פתרון 1)
2. ✅ **אם אין** → צור PostgreSQL (פתרון 1)
3. ✅ **אם יש** → בדוק ש-DATABASE_URL מוגדר (פתרון 2)
4. ✅ **לחץ Restart** על ה-API Service
5. ✅ **חכה 2-3 דקות**
6. ✅ **בדוק שוב את ה-Logs** - אמור לעבוד!

---

## 🔍 איך לבדוק ש-PostgreSQL עובד:

1. **PostgreSQL Service** → **"Logs"**
2. **חפש הודעות כמו:**
   - "database system is ready to accept connections"
   - "PostgreSQL init process complete"

**אם אתה רואה את זה** → PostgreSQL עובד! ✅

---

## ⚠️ חשוב!

**אחרי יצירת PostgreSQL:**
- **הרץ Migrations** לפני ה-Restart:
  1. **API Service** → **"Deployments"** → **"Run Command"**
  2. הרץ:
     ```
     pnpm --filter @furniture/prisma migrate deploy
     ```
  3. **חכה לסיום**
  4. **אז לחץ Restart**

---

## 🆘 עדיין לא עובד?

**בדוק:**
1. האם PostgreSQL Service במצב "Active" (ירוק)?
2. האם `DATABASE_URL` מוגדר ב-API Service Variables?
3. האם הרצת Migrations?

**אם הכל נכון ועדיין לא עובד:**
- שלח לי את ה-Logs של PostgreSQL Service
- שלח לי את ה-Logs של API Service

---

**התחל עם בדיקה אם יש PostgreSQL Service!** 🗄️

