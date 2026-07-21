import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Loader2, Sparkles, Trash2, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import type { Todo, CreateTodoPayload, UpdateTodoPayload, TodoPriority, TodoStatus, Subtask, Recurring } from "../types";
import { useTodoStore } from "../store/todoStore";
import { useCollectionStore } from "../store/collectionStore";
import AITodoGenerator from "./AITodoGenerator";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Study", "Home"];

const TodoModal = ({ isOpen, onClose, editTodo }: TodoModalProps) => {
  const { t } = useTranslation();
  const { createTodo, updateTodo } = useTodoStore();
  const { collections, fetchCollections } = useCollectionStore();
  const isEdit = !!editTodo;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("pending");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [subtaskInput, setSubtaskInput] = useState("");
  const [recurring, setRecurring] = useState<Recurring>({ interval: "none" });
  const [collectionId, setCollectionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCollections();
      if (editTodo) {
        setTitle(editTodo.title);
        setDescription(editTodo.description);
        setStatus(editTodo.status);
        setPriority(editTodo.priority);
        setDueDate(editTodo.dueDate ? editTodo.dueDate.split("T")[0] : "");
        setCategory(editTodo.category || "");
        setCustomCategory("");
        setTags(editTodo.tags || []);
        setSubtasks(editTodo.subtasks || []);
        setRecurring(editTodo.recurring || { interval: "none" });
        setCollectionId(editTodo.collectionId || "");
      } else {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setDueDate("");
        setCategory("");
        setCustomCategory("");
        setTags([]);
        setSubtasks([]);
        setRecurring({ interval: "none" });
        setCollectionId("");
      }
    }
  }, [isOpen, editTodo]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddSubtask = () => {
    const text = subtaskInput.trim();
    if (text) {
      setSubtasks([...subtasks, { text, completed: false }]);
      setSubtaskInput("");
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error(t("todo.titleRequired"));
      return;
    }
    if (!description.trim()) {
      toast.error(t("todo.descriptionRequired"));
      return;
    }

    const finalCategory = customCategory.trim() || category;
    const finalCollectionId = collectionId || undefined;

    setIsLoading(true);
    try {
      if (isEdit && editTodo) {
        const payload: UpdateTodoPayload = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate || null,
          category: finalCategory || undefined,
          tags,
          subtasks,
          recurring,
          collectionId: finalCollectionId || null,
        };
        await updateTodo(editTodo._id, payload);
        toast.success(t("todo.updated"));
      } else {
        const payload: CreateTodoPayload = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate || undefined,
          category: finalCategory || undefined,
          tags,
          subtasks,
          recurring: recurring.interval !== "none" ? recurring : undefined,
          collectionId: finalCollectionId,
        };
        await createTodo(payload);
        toast.success(t("todo.created"));
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions: { value: TodoPriority; label: string; color: string }[] = [
    { value: "low", label: t("todo.low"), color: "#22c55e" },
    { value: "medium", label: t("todo.medium"), color: "#f59e0b" },
    { value: "high", label: t("todo.high"), color: "#ef4444" },
    { value: "urgent", label: t("todo.urgent") + " 🔥", color: "#dc2626" },
  ];

  const statusOptions: { value: TodoStatus; label: string; color: string }[] = [
    { value: "pending", label: t("todo.pending"), color: "#f59e0b" },
    { value: "in-progress", label: t("todo.inProgress"), color: "#3b82f6" },
    { value: "completed", label: t("todo.completed"), color: "#10b981" },
  ];

  const recurringOptions = [
    { value: "none", label: t("todo.recurringNone") },
    { value: "daily", label: t("todo.recurringDaily") },
    { value: "weekly", label: t("todo.recurringWeekly") },
    { value: "monthly", label: t("todo.recurringMonthly") },
  ] as const;

  const inputStyle = {
    width: "100%",
    background: "rgba(20, 16, 50, 0.6)",
    border: "1px solid rgba(124,58,237,0.2)",
    borderRadius: 10,
    padding: "11px 14px",
    fontSize: "0.9rem",
    color: "var(--color-text-primary)",
    outline: "none",
    fontFamily: "var(--font-family)",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  };

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "var(--color-text-secondary)",
    marginBottom: 6,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              zIndex: 50,
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
                maxHeight: "90vh",
                overflowY: "auto",
                background: "rgba(10, 8, 28, 0.97)",
                backdropFilter: "blur(24px)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 20,
                padding: "28px 28px",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(124,58,237,0.1)",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text-primary)", marginBottom: 2 }}>
                    {isEdit ? t("todo.edit") : t("todo.create")}
                  </h2>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                    {isEdit ? t("todo.editDesc") : t("todo.createDesc")}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {!isEdit && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAIGenerator(true)}
                      title="AI Todo Generator"
                      style={{
                        background: "rgba(245,200,66,0.1)",
                        border: "1px solid rgba(245,200,66,0.3)",
                        borderRadius: 10,
                        padding: "8px",
                        cursor: "pointer",
                        color: "#f5c842",
                        display: "flex",
                      }}
                    >
                      <Sparkles size={18} />
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 10,
                      padding: "8px",
                      cursor: "pointer",
                      color: "var(--color-text-muted)",
                      display: "flex",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Form Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {/* Title */}
                <div>
                  <label style={labelStyle}>{t("todo.title")} *</label>
                  <input
                    id="todo-title"
                    type="text"
                    placeholder={t("todo.titlePlaceholder")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={labelStyle}>{t("todo.description")} *</label>
                  <textarea
                    id="todo-description"
                    placeholder={t("todo.descriptionPlaceholder")}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    style={{ ...inputStyle, resize: "vertical", minHeight: 80 }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Priority */}
                <div>
                  <label style={labelStyle}>{t("todo.priority")}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setPriority(opt.value)}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 10,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1px solid ${priority === opt.value ? opt.color : "rgba(255,255,255,0.08)"}`,
                          background: priority === opt.value ? `${opt.color}18` : "transparent",
                          color: priority === opt.value ? opt.color : "var(--color-text-muted)",
                          transition: "all 0.15s ease",
                          fontFamily: "var(--font-family)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status (only in edit mode) */}
                {isEdit && (
                  <div>
                    <label style={labelStyle}>{t("todo.status")}</label>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setStatus(opt.value)}
                          style={{
                            padding: "8px 16px",
                            borderRadius: 10,
                            fontSize: "0.85rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            border: `1px solid ${status === opt.value ? opt.color : "rgba(255,255,255,0.08)"}`,
                            background: status === opt.value ? `${opt.color}18` : "transparent",
                            color: status === opt.value ? opt.color : "var(--color-text-muted)",
                            transition: "all 0.15s ease",
                            fontFamily: "var(--font-family)",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Due Date */}
                <div>
                  <label style={labelStyle}>{t("todo.dueDate")}</label>
                  <input
                    id="todo-due-date"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ ...inputStyle, colorScheme: "dark" }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>

                {/* Recurring */}
                <div>
                  <label style={labelStyle}>{t("todo.recurring")}</label>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {recurringOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setRecurring({ ...recurring, interval: opt.value })}
                        style={{
                          padding: "8px 16px",
                          borderRadius: 10,
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: `1px solid ${recurring.interval === opt.value ? "rgba(124,58,237,0.6)" : "rgba(255,255,255,0.08)"}`,
                          background: recurring.interval === opt.value ? "rgba(124,58,237,0.15)" : "transparent",
                          color: recurring.interval === opt.value ? "#a78bfa" : "var(--color-text-muted)",
                          transition: "all 0.15s ease",
                          fontFamily: "var(--font-family)",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Collection */}
                <div>
                  <label style={labelStyle}>{t("todo.collection")}</label>
                  <select
                    value={collectionId}
                    onChange={(e) => setCollectionId(e.target.value)}
                    style={{
                      ...inputStyle,
                      cursor: "pointer",
                    }}
                  >
                    <option value="" style={{ background: "#0a081c" }}>{t("todo.noCollection")}</option>
                    {collections.map((col) => (
                      <option key={col._id} value={col._id} style={{ background: "#0a081c" }}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label style={labelStyle}>{t("todo.tags")}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder={t("todo.tagsPlaceholder")}
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                      style={inputStyle}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddTag}
                      style={{
                        padding: "11px 14px",
                        background: "rgba(124,58,237,0.15)",
                        border: "1px solid rgba(124,58,237,0.3)",
                        borderRadius: 10,
                        cursor: "pointer",
                        color: "#a78bfa",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  {tags.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {tags.map((tag) => (
                        <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: "0.75rem", fontWeight: 500, background: "rgba(124,58,237,0.1)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}>
                          #{tag}
                          <button onClick={() => handleRemoveTag(tag)} style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", display: "flex", padding: 0, fontSize: "0.7rem" }}>
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtasks */}
                <div>
                  <label style={labelStyle}>{t("todo.subtasks")}</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      placeholder={t("todo.subtaskPlaceholder")}
                      value={subtaskInput}
                      onChange={(e) => setSubtaskInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); } }}
                      style={inputStyle}
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleAddSubtask}
                      style={{
                        padding: "11px 14px",
                        background: "rgba(16,185,129,0.15)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        borderRadius: 10,
                        cursor: "pointer",
                        color: "#10b981",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Plus size={16} />
                    </motion.button>
                  </div>
                  {subtasks.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                      {subtasks.map((st, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "rgba(20, 16, 50, 0.4)", borderRadius: 8, border: "1px solid rgba(124,58,237,0.1)" }}>
                          <button
                            onClick={() => {
                              const updated = [...subtasks];
                              updated[idx] = { ...updated[idx], completed: !updated[idx].completed };
                              setSubtasks(updated);
                            }}
                            style={{
                              width: 18,
                              height: 18,
                              borderRadius: "50%",
                              border: `2px solid ${st.completed ? "#10b981" : "rgba(255,255,255,0.2)"}`,
                              background: st.completed ? "#10b981" : "transparent",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              flexShrink: 0,
                            }}
                          >
                            {st.completed && <Check size={12} color="white" />}
                          </button>
                          <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--color-text-primary)", textDecoration: st.completed ? "line-through" : "none", opacity: st.completed ? 0.6 : 1 }}>
                            {st.text}
                          </span>
                          <button onClick={() => handleRemoveSubtask(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-muted)", display: "flex", padding: 2 }}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label style={labelStyle}>{t("todo.category")}</label>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => { setCategory(cat === category ? "" : cat); setCustomCategory(""); }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 999,
                          fontSize: "0.78rem",
                          fontWeight: 500,
                          cursor: "pointer",
                          border: `1px solid ${category === cat ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                          background: category === cat ? "rgba(124,58,237,0.15)" : "transparent",
                          color: category === cat ? "#a78bfa" : "var(--color-text-muted)",
                          transition: "all 0.15s ease",
                          fontFamily: "var(--font-family)",
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <input
                    id="todo-custom-category"
                    type="text"
                    placeholder={t("todo.categoryPlaceholder")}
                    value={customCategory}
                    onChange={(e) => { setCustomCategory(e.target.value); if (e.target.value) setCategory(""); }}
                    style={inputStyle}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onClose} style={{ flex: 1, padding: "12px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "var(--color-text-secondary)", fontSize: "0.9rem", fontWeight: 500, cursor: "pointer", fontFamily: "var(--font-family)" }}>
                  {t("todo.cancel")}
                </motion.button>
                <motion.button
                  id="todo-submit-button"
                  whileHover={!isLoading ? { scale: 1.02, y: -1 } : {}}
                  whileTap={!isLoading ? { scale: 0.97 } : {}}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{
                    flex: 2,
                    padding: "12px",
                    background: isLoading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #9333ea)",
                    border: "none",
                    borderRadius: 12,
                    color: "white",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    boxShadow: isLoading ? "none" : "0 4px 16px rgba(124,58,237,0.4)",
                    fontFamily: "var(--font-family)",
                    transition: "all 0.2s ease",
                  }}
                >
                  {isLoading ? (
                    <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} /> Saving...</>
                  ) : isEdit ? (
                    <><Save size={16} /> {t("todo.save")}</>
                  ) : (
                    <><Plus size={16} /> {t("todo.create")}</>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Generator Modal */}
      <AITodoGenerator isOpen={showAIGenerator} onClose={() => setShowAIGenerator(false)} />
    </>
  );
};

export default TodoModal;
