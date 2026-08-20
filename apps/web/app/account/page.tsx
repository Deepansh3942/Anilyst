import { auth, signIn, signOut } from "../../auth";

export default async function AccountPage() {
  const session = await auth();

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <h1>Account</h1>

      {session?.user ? (
        <>
          <p>Signed in as {session.user.name ?? session.user.email}</p>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/account" });
            }}
          >
            <button type="submit" style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}>
              Sign out
            </button>
          </form>
        </>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/account" });
          }}
        >
          <button type="submit" style={{ padding: "0.5rem 1rem" }}>
            Sign in with GitHub
          </button>
        </form>
      )}
    </main>
  );
}
