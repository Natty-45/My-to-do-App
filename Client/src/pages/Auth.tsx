import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, Sparkles, Eye, EyeOff, KeyRound, HelpCircle, ArrowLeft } from "lucide-react";
import { login, getSecurityQuestion, resetPassword } from "../services/auth";
import { useAuth } from "../context/AuthContext";

type AuthMode = "login" | "reset";

const Auth = () => {
  const [showForm, setShowForm] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  
  // Login State
  const [password, setPassword] = useState("");
  
  // Reset State
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [error, setError] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const clientName = import.meta.env.VITE_CLIENT_NAME || "there";
  const navigate = useNavigate();
  const { login: loginCtx, isAuth } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect to home
    if (isAuth) {
      navigate("/", { replace: true });
      return;
    }
    const timer = setTimeout(() => setShowForm(true), 1500);
    return () => clearTimeout(timer);
  }, [isAuth, navigate]);

  const fetchQuestion = async () => {
    try {
      setLoading(true);
      const res = await getSecurityQuestion();
      setSecurityQuestion(res.question);
      setMode("reset");
      setError(false);
    } catch (err) {
      toast.error("Could not fetch security question.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async () => {
    if (!password.trim()) {
      toast.error("Please enter your password.");
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      await login(password);
      loginCtx();
      toast.success("Welcome back! 🎉");
      setTimeout(() => navigate("/"), 300);
    } catch (err: any) {
      setError(true);
      setPassword("");
      const msg = err.response?.data?.message || "Incorrect password.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async () => {
    if (!securityAnswer.trim() || !newPassword.trim()) {
      toast.error("Please fill in all fields.");
      setError(true);
      return;
    }

    setLoading(true);
    setError(false);

    try {
      await resetPassword(securityAnswer, newPassword);
      toast.success("Password reset successfully! ✨");
      setMode("login");
      setSecurityAnswer("");
      setNewPassword("");
      setPassword("");
    } catch (err: any) {
      setError(true);
      const msg = err.response?.data?.message || "Incorrect answer or something went wrong.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (mode === "login") handleLoginSubmit();
      if (mode === "reset") handleResetSubmit();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--gradient-hero)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background orbs */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -25, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          style={{
            position: "absolute",
            bottom: "15%",
            right: "10%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 440,
          margin: "0 16px",
          background: "rgba(12, 10, 28, 0.85)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(124, 58, 237, 0.2)",
          borderRadius: 24,
          padding: "48px 40px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,58,237,0.1)",
        }}
      >
        {/* Logo / Icon area */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 20,
              background: "linear-gradient(135deg, #7c3aed, #9333ea)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.4)",
              marginBottom: 24,
            }}
          >
            {mode === "login" ? <Sparkles size={32} color="white" /> : <KeyRound size={32} color="white" />}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              fontSize: "2rem",
              fontWeight: 800,
              lineHeight: 1.2,
              marginBottom: 8,
              background: "linear-gradient(135deg, #f5c842, #ffffff, #a78bfa)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {mode === "login" ? "My To-Do App" : "Reset Password"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.95rem",
            }}
          >
            {mode === "login" ? "Your personal productivity hub ✨" : "Answer your security question."}
          </motion.p>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">
          {showForm && mode === "login" && (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div style={{ marginBottom: 8 }}>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: 16 }}>
                  Hello,{" "}
                  <span style={{ color: "#f5c842", fontWeight: 600 }}>
                    {clientName}
                  </span>{" "}
                  👋 Enter your password to continue.
                </p>

                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    color="var(--color-text-muted)"
                    style={{
                      position: "absolute",
                      left: 14,
                      top: "50%",
                      transform: "translateY(-50%)",
                      pointerEvents: "none",
                    }}
                  />
                  <motion.input
                    animate={error ? { x: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
                    transition={{ duration: 0.5 }}
                    type={showPassword ? "text" : "password"}
                    id="password-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    onKeyDown={handleKeyDown}
                    style={{
                      width: "100%",
                      background: error
                        ? "rgba(239,68,68,0.08)"
                        : "rgba(30, 20, 60, 0.6)",
                      border: `1px solid ${error ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.2)"}`,
                      borderRadius: 12,
                      padding: "13px 44px",
                      fontSize: "0.95rem",
                      color: "var(--color-text-primary)",
                      outline: "none",
                      transition: "all 0.2s ease",
                      fontFamily: "var(--font-family)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = error
                        ? "rgba(239,68,68,0.7)"
                        : "rgba(124,58,237,0.6)";
                      e.target.style.boxShadow = error
                        ? "0 0 0 3px rgba(239,68,68,0.1)"
                        : "0 0 0 3px rgba(124,58,237,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    onClick={() => setShowPassword((p) => !p)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--color-text-muted)",
                      display: "flex",
                      alignItems: "center",
                      padding: 4,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
                <button
                  onClick={fetchQuestion}
                  disabled={loading}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#a78bfa",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-family)",
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <motion.button
                id="login-button"
                onClick={handleLoginSubmit}
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                style={{
                  width: "100%",
                  padding: "13px 0",
                  background: loading
                    ? "rgba(124,58,237,0.5)"
                    : "linear-gradient(135deg, #7c3aed, #9333ea)",
                  border: "none",
                  borderRadius: 12,
                  color: "white",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                  fontFamily: "var(--font-family)",
                  transition: "all 0.2s ease",
                }}
              >
                {loading ? "Signing in..." : "Sign In →"}
              </motion.button>
            </motion.div>
          )}

          {showForm && mode === "reset" && (
            <motion.div
              key="reset-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", marginBottom: 6 }}>
                  Security Question:
                </p>
                <div style={{
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 12,
                  padding: "12px",
                  fontSize: "0.95rem",
                  color: "#e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <HelpCircle size={16} color="#a78bfa" />
                  {securityQuestion}
                </div>
              </div>

              <div>
                <motion.input
                  animate={error ? { x: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  type="text"
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChange={(e) => {
                    setSecurityAnswer(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    background: "rgba(30, 20, 60, 0.6)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    fontSize: "0.95rem",
                    color: "var(--color-text-primary)",
                    outline: "none",
                    fontFamily: "var(--font-family)",
                  }}
                />
              </div>

              <div>
                <motion.input
                  animate={error ? { x: [0, -10, 10, -7, 7, -3, 3, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={handleKeyDown}
                  style={{
                    width: "100%",
                    background: "rgba(30, 20, 60, 0.6)",
                    border: "1px solid rgba(124,58,237,0.2)",
                    borderRadius: 12,
                    padding: "13px 16px",
                    fontSize: "0.95rem",
                    color: "var(--color-text-primary)",
                    outline: "none",
                    fontFamily: "var(--font-family)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                <motion.button
                  onClick={() => { setMode("login"); setError(false); }}
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    flex: 1,
                    padding: "13px 0",
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 12,
                    color: "var(--color-text-secondary)",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                    fontFamily: "var(--font-family)",
                  }}
                >
                  <ArrowLeft size={16} /> Back
                </motion.button>
                <motion.button
                  onClick={handleResetSubmit}
                  disabled={loading}
                  whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                  style={{
                    flex: 2,
                    padding: "13px 0",
                    background: loading
                      ? "rgba(124,58,237,0.5)"
                      : "linear-gradient(135deg, #7c3aed, #9333ea)",
                    border: "none",
                    borderRadius: 12,
                    color: "white",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    cursor: loading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
                    fontFamily: "var(--font-family)",
                  }}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showForm && (
          <div style={{ textAlign: "center", paddingTop: 20 }}>
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}
            >
              Loading...
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
