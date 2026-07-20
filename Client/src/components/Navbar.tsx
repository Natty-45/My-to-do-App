import { motion } from "framer-motion";
import { Sun, Moon, LogOut, CheckSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/themeContext";

const Navbar = () => {
  const clientName = import.meta.env.VITE_CLIENT_NAME || "You";
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    toast.success("See you soon! 👋");
    navigate("/auth", { replace: true });
  };

  return (
    <nav
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: "rgba(10, 8, 20, 0.8)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(124, 58, 237, 0.15)",
        padding: "0 24px",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Left — greeting */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--color-text-secondary)",
          fontSize: "0.9rem",
          fontWeight: 500,
        }}
      >
        <span>Hey,</span>
        <span style={{ color: "#f5c842", fontWeight: 700, fontSize: "1rem" }}>
          {clientName}
        </span>
        <span>👋</span>
      </motion.div>

      {/* Center — Logo/Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            borderRadius: 10,
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <CheckSquare size={18} color="white" />
        </div>
        <span
          style={{
            fontWeight: 800,
            fontSize: "1.05rem",
            background: "linear-gradient(135deg, #f5c842, #a78bfa)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          My To-Do App
        </span>
      </motion.div>

      {/* Right — actions */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {/* Theme toggle */}
        <motion.button
          id="theme-toggle"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          style={{
            background: "rgba(124, 58, 237, 0.1)",
            border: "1px solid rgba(124, 58, 237, 0.2)",
            borderRadius: 10,
            padding: "8px 10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            color: "var(--color-text-secondary)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--color-text-secondary)";
          }}
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </motion.button>

        {/* Logout */}
        <motion.button
          id="logout-button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            borderRadius: 10,
            padding: "8px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#ef4444",
            fontSize: "0.85rem",
            fontWeight: 500,
            transition: "all 0.2s ease",
            fontFamily: "var(--font-family)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.18)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
          }}
        >
          <LogOut size={15} />
          <span className="hidden md:inline">Logout</span>
        </motion.button>
      </motion.div>
    </nav>
  );
};

export default Navbar;