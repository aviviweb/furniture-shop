export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form method="post" action="#" style={{ display: 'grid', gap: 8 }}>
        <h2 className="text-3xl">כניסה</h2>
        <input name="email" placeholder="אימייל" />
        <input name="password" type="password" placeholder="סיסמה" />
        <button type="submit">התחבר</button>
      </form>
    </div>
  );
}


