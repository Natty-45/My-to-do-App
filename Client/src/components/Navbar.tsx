import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogOut, CheckSquare, Globe, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/themeContext";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "am", label: "Amharic", native: "አማርኛ" },
  { code: "zh", label: "Chinese", native: "中文" },
  { code: "es", label: "Spanish", native: "Español" },
  { code: "ar", label: "Arabic", native: "العربية" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "fr", label: "French", native: "Français" },
  { code: "pt", label: "Portuguese", native: "Português" },
  { code: "ru", label: "Russian", native: "Русский" },
  { code: "ja", label: "Japanese", native: "日本語" },
  { code: "de", label: "German", native: "Deutsch" },
];

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const clientName = import.meta.env.VITE_CLIENT_NAME || t("nav.hey");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("See you soon! 👋");
    navigate("/auth", { replace: true });
  };

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("todo_lang", code);
    setShowLangMenu(false);
  };

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

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
        style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--color-text-secondary)", fontSize: "0.9rem", fontWeight: 500 }}
      >
        <span>{t("nav.hey")},</span>
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
        <div style={{ background: "linear-gradient(135deg, #7c3aed, #9333ea)", borderRadius: 10, padding: "6px 8px", display: "flex", alignItems: "center" }}>
          <CheckSquare size={18} color="white" />
        </div>
        <span style={{ fontWeight: 800, fontSize: "1.05rem", background: "linear-gradient(135deg, #f5c842, #a78bfa)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {t("app.title")}
        </span>
      </motion.div>

      {/* Right — actions */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        {/* Language switcher */}
        <div ref={langRef} style={{ position: "relative" }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLangMenu(!showLangMenu)}
            title={t("nav.language")}
            style={{
              background: "rgba(124, 58, 237, 0.1)",
              border: "1px solid rgba(124, 58, 237, 0.2)",
              borderRadius: 10,
              padding: "8px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "var(--color-text-secondary)",
              fontSize: "0.8rem",
              fontWeight: 500,
              fontFamily: "var(--font-family)",
              transition: "all 0.2s ease",
            }}
          >
            <Globe size={16} />
            <span style={{ minWidth: 28 }}>{currentLang.code.toUpperCase()}</span>
          </motion.button>

          <AnimatePresence>
            {showLangMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "rgba(10, 8, 28, 0.98)",
                  backdropFilter: "blur(24px)",
                  border: "1px solid rgba(124,58,237,0.25)",
                  borderRadius: 14,
                  padding: "8px",
                  boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  minWidth: 180,
                  zIndex: 100,
                  maxHeight: 320,
                  overflowY: "auto",
                }}
              >
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: 8,
                      border: "none",
                      background: i18n.language === lang.code ? "rgba(124,58,237,0.15)" : "transparent",
                      color: i18n.language === lang.code ? "#a78bfa" : "var(--color-text-secondary)",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      fontFamily: "var(--font-family)",
                      transition: "all 0.1s ease",
                      textAlign: "left",
                    }}
                    onMouseEnter={(e) => { if (i18n.language !== lang.code) e.currentTarget.style.background = "rgba(124,58,237,0.08)"; }}
                    onMouseLeave={(e) => { if (i18n.language !== lang.code) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span>{lang.native}</span>
                    <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Theme toggle */}
        <motion.button
          id="theme-toggle"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          title={theme === "dark" ? t("nav.lightMode") : t("nav.darkMode")}
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
        >
          <LogOut size={15} />
          <span>{t("nav.logout")}</span>
        </motion.button>
      </motion.div>
    </nav>
  );
};

export default Navbar;
