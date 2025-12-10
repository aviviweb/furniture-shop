# איך להתחבר ל-Railway - שלב אחר שלב

## 🔑 אופציה 1: דרך Pairing Code (עכשיו)

**יש לך pairing code:** `tan-adaptable-youth`

### שלבים:

1. **פתח את ה-URL הזה בדפדפן:**
   ```
   https://railway.com/cli-login?d=d29yZENvZGU9dGFuLWFkYXB0YWJsZS15b3V0aCZob3N0bmFtZT1ERVNLVE9QLU1WVU81VVY=
   ```

2. **הזן את ה-pairing code:** `tan-adaptable-youth`

3. **אשר את ההרשאות**

4. **חזור ל-Terminal והרץ:**
   ```powershell
   railway whoami
   ```

---

## 🔑 אופציה 2: יצירת Token (מומלץ)

### שלבים:

1. **פתח Railway Dashboard:**
   - [railway.app](https://railway.app)
   - התחבר לחשבון שלך

2. **Settings → Tokens:**
   - לחץ "New Token"
   - תן שם (למשל: "CLI Token")
   - לחץ "Create"
   - **העתק את ה-Token** (תראה אותו רק פעם אחת!)

3. **ב-Terminal, הרץ:**
   ```powershell
   $env:RAILWAY_TOKEN = "הדבק-את-ה-token-כאן"
   railway whoami
   ```

4. **אם זה עובד, שמור את ה-Token:**
   ```powershell
   # פתח את ה-Profile:
   notepad $PROFILE
   
   # הוסף את השורה הזו:
   $env:RAILWAY_TOKEN = "הדבק-את-ה-token-כאן"
   
   # שמור וסגור
   ```

---

## 🔑 אופציה 3: התחברות רגילה (נסה שוב)

```powershell
railway login
```

**לחץ Y כשיתבקש**

**אם זה לא עובד:**
- בדוק שהדפדפן לא חוסם popups
- נסה דפדפן אחר
- נסה `railway login --browserless` שוב

---

## ✅ בדיקה

אחרי כל אחת מהאופציות, בדוק:

```powershell
railway whoami
```

**אמור לראות את השם שלך** ✅

---

## 🆘 אם עדיין לא עובד

1. **עדכן Railway CLI:**
   ```powershell
   pnpm update -g @railway/cli
   ```

2. **נסה להתקין מחדש:**
   ```powershell
   pnpm remove -g @railway/cli
   pnpm add -g @railway/cli
   ```

3. **בדוק את ה-Version:**
   ```powershell
   railway --version
   ```

---

## 💡 המלצה

**השתמש ב-Token (אופציה 2)** - זה הכי אמין ולא דורש דפדפן!

