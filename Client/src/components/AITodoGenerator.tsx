import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Plus, Loader2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useTodoStore } from "../store/todoStore";
import type { AIGeneratedTodo } from "../types";

interface AITodoGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

const AITodoGenerator = ({ isOpen, onClose }: AITodoGeneratorProps) => {
  const { t } = useTranslation();
  const { createTodo } = useTodoStore();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTodos, setGeneratedTodos] = useState<AIGeneratedTodo[]>([]);

  const priorityColors: Record<string, string> = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
    urgent: "#dc2626",
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your task idea.");
      return;
    }

    setIsGenerating(true);
    setGeneratedTodos([]);

    try {
      const token = localStorage.getItem("todo_token");
      const response = await fetch("http://localhost:5001/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to generate");
      }

      setGeneratedTodos(data.data);
      toast.success(`Generated ${data.data.length} todos! ✨`);
    } catch (err: any) {
      toast.error(err.message || t("ai.error"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddAll = async () => {
    let count = 0;
    for (const gt of generatedTodos) {
      try {
        await createTodo({
          title: gt.title,
          description: gt.description,
          priority: gt.priority as any,
          category: gt.category || undefined,
          tags: gt.tags || [],
        });
        count++;
      } catch {
        // continue adding the rest
      }
    }
    if (count > 0) {
      toast.success(t("ai.success", { count }));
      setGeneratedTodos([]);
      setPrompt("");
      onClose();
    }
  };

  const inputStyle = {
    width: "100%",
    background: "rgba(20, 16, 50, 0.6)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: 12,
    padding: "14px 18px",
    fontSize: "0.9rem",
    color: "var(--color-text-primary)",
    outline: "none",
    fontFamily: "var(--font-family)",
    transition: "border-color 0.2s ease",
    resize: "vertical" as const,
    minHeight: 100,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(6px)",
            zIndex: 55,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 560,
              maxHeight: "85vh",
              overflowY: "auto",
              background: "rgba(10, 8, 28, 0.97)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 20,
              padding: "28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ background: "linear-gradient(135deg, #f5c842, #f59e0b)", borderRadius: 10, padding: "8px", display: "flex" }}>
                    <Sparkles size={18} color="#1a1000" />
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
                    {t("ai.title")}
                  </h2>
                </div>
                <p style={{ fontSize: "0.85rem", color: "var(--color-text-muted)", marginTop: 6 }}>
                  {t("ai.description")}
                </p>
              </div>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 8, cursor: "pointer", color: "var(--color-text-muted)", display: "flex", flexShrink: 0 }}>
                <X size={18} />
              </motion.button>
            </div>

            {/* Input */}
            <textarea
              placeholder={t("ai.placeholder")}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = "rgba(245,200,66,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,200,66,0.12)"; }}
              onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
            />

            {/* Generate button */}
            <motion.button
              whileHover={!isGenerating ? { scale: 1.02, y: -1 } : {}}
              whileTap={!isGenerating ? { scale: 0.97 } : {}}
              onClick={handleGenerate}
              disabled={isGenerating}
              style={{
                width: "100%",
                padding: "14px",
                marginTop: 14,
                background: isGenerating ? "rgba(245,200,66,0.5)" : "linear-gradient(135deg, #f5c842, #f59e0b)",
                border: "none",
                borderRadius: 12,
                color: "#1a1000",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: isGenerating ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: isGenerating ? "none" : "0 4px 20px rgba(245,200,66,0.4)",
                fontFamily: "var(--font-family)",
                transition: "all 0.2s ease",
              }}
            >
              {isGenerating ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} style={{ width: 18, height: 18, border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#1a1000", borderRadius: "50%" }} />
                  {t("ai.generating")}
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  {t("ai.generate")}
                </>
              )}
            </motion.button>

            {/* Generated results */}
            <AnimatePresence>
              {generatedTodos.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{ marginTop: 24 }}
                >
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: 12 }}>
                    Generated Todos:
                  </h3>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {generatedTodos.map((gt, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08 }}
                        style={{
                          padding: "14px 16px",
                          background: "rgba(20, 16, 50, 0.5)",
                          border: "1px solid rgba(124,58,237,0.15)",
                          borderRadius: 12,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(124,58,237,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a78bfa", fontSize: "0.75rem", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>
                            {idx + 1}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--color-text-primary)" }}>{gt.title}</span>
                              <span style={{ fontSize: "0.7rem", fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: `${priorityColors[gt.priority] || "#7c3aed"}20`, color: priorityColors[gt.priority] || "#a78bfa", border: `1px solid ${priorityColors[gt.priority] || "#7c3aed"}40` }}>
                                {gt.priority?.toUpperCase()}
                              </span>
                            </div>
                            <p style={{ fontSize: "0.82rem", color: "var(--color-text-muted)", marginTop: 4, lineHeight: 1.4 }}>{gt.description}</p>
                            {gt.category && (
                              <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)", marginTop: 6, display: "inline-block", padding: "2px 8px", borderRadius: 999, background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.15)" }}>
                                {gt.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddAll}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginTop: 16,
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      border: "none",
                      borderRadius: 12,
                      color: "white",
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
                      fontFamily: "var(--font-family)",
                    }}
                  >
                    <Plus size={18} />
                    {t("ai.addAll")}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AITodoGenerator;
