import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import ErrorMessage from "../components/ui/ErrorMessage";
import api from "../services/api";
import useStudioStore from "../store/useStudioStore";

const emptyForm = {
  name: "",
  email: "",
  password: "",
};

export default function AuthPage() {
  const navigate = useNavigate();
  const { setToken, setUser } = useStudioStore();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegisterMode = mode === "register";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const endpoint = isRegisterMode ? "/auth/register" : "/auth/login";
      const payload = isRegisterMode
        ? {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }
        : {
          email: form.email.trim(),
          password: form.password,
        };

      const { data } = await api.post(endpoint, payload);

      setToken(data.token);
      setUser(data.user);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        "Unable to authenticate. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-card__intro">
          <p className="eyebrow">AI Venture Studio</p>
          <h1>{isRegisterMode ? "Create your account" : "Welcome back"}</h1>
          <p>
            Sign in to view your dashboard, manage projects, and continue your
            venture workspace.
          </p>
        </div>

        <div className="auth-tabs" aria-label="Authentication mode">
          <button
            type="button"
            className={mode === "login" ? "auth-tab auth-tab--active" : "auth-tab"}
            onClick={() => switchMode("login")}
          >
            <LogIn size={16} aria-hidden="true" />
            Login
          </button>
          <button
            type="button"
            className={
              mode === "register" ? "auth-tab auth-tab--active" : "auth-tab"
            }
            onClick={() => switchMode("register")}
          >
            <UserPlus size={16} aria-hidden="true" />
            Register
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          {error ? <ErrorMessage message={error} /> : null}

          {isRegisterMode ? (
            <label className="form-field">
              <span>Name</span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </label>
          ) : null}

          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
            />
          </label>

          <label className="form-field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
              required
              minLength="6"
              disabled={isSubmitting}
            />
          </label>

          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Please wait..."
              : isRegisterMode
                ? "Create Account"
                : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
}
