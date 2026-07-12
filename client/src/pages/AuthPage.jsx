import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import ErrorMessage from "../components/ui/ErrorMessage";
import api from "../services/api";
import useStudioStore from "../store/useStudioStore";
import "../styles/auth.css";
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
    <div className="auth-container">

      {/* LEFT SIDE */}

      <section className="auth-left">

        <div className="logo">
          🤖 AI Venture
        </div>

        <h1>
          Validate.
          <br />
          Analyze.
          <br />
          Build Better Startups.
        </h1>

        <p className="hero-text">
          AI Venture helps founders validate startup ideas using AI,
          Executive Boardroom Simulation, Smart Analytics and an
          AI Copilot.
        </p>

        <div className="feature-list">

          <div className="feature-card">
            <span>🤖</span>
            <div>
              <h3>AI Validation</h3>
              <p>Generate detailed startup reports instantly.</p>
            </div>
          </div>

          <div className="feature-card">
            <span>🏛️</span>
            <div>
              <h3>Boardroom</h3>
              <p>Get CEO, CTO, CFO and CMO opinions.</p>
            </div>
          </div>

          <div className="feature-card">
            <span>📊</span>
            <div>
              <h3>Analytics</h3>
              <p>Understand strengths, risks and opportunities.</p>
            </div>
          </div>

          <div className="feature-card">
            <span>🤖</span>
            <div>
              <h3>AI Copilot</h3>
              <p>Ask questions about your startup anytime.</p>
            </div>
          </div>

        </div>

      </section>

      {/* RIGHT SIDE */}

      <section className="auth-right">

        <div className="auth-card">

          <div className="auth-card__intro">
            <p className="eyebrow">AI Venture Studio</p>

            <h1>
              {isRegisterMode
                ? "Create your account"
                : "Welcome Back"}
            </h1>

            <p>
              Continue building your startup journey.
            </p>
          </div>

          <div
            className="auth-tabs"
            aria-label="Authentication mode"
          >
            <button
              type="button"
              className={
                mode === "login"
                  ? "auth-tab auth-tab--active"
                  : "auth-tab"
              }
              onClick={() => switchMode("login")}
            >
              <LogIn size={16} />
              Login
            </button>

            <button
              type="button"
              className={
                mode === "register"
                  ? "auth-tab auth-tab--active"
                  : "auth-tab"
              }
              onClick={() => switchMode("register")}
            >
              <UserPlus size={16} />
              Register
            </button>
          </div>

          <form
            className="form"
            onSubmit={handleSubmit}
          >

            {error ? (
              <ErrorMessage message={error} />
            ) : null}

            {isRegisterMode && (
              <label className="form-field">
                <span>Name</span>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  required
                  disabled={isSubmitting}
                />
              </label>
            )}

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
                placeholder="••••••••"
                required
                minLength="6"
                disabled={isSubmitting}
              />
            </label>

            <button
              type="submit"
              className="btn btn--primary auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Please wait..."
                : isRegisterMode
                ? "Create Account"
                : "Login"}
            </button>

          </form>

        </div>

      </section>

    </div>
  </main>
);
}
