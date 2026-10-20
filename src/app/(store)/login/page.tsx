import LoginForm from "@/components/auth/LoginForm";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <div className="container-x grid place-items-center py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="font-serif text-3xl font-medium">Welcome back</h1>
          <p className="mb-6 mt-1 text-sm text-ink/50">Login to your Khairpur Dates House account.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
