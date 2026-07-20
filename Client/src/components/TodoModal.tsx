import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Todo, CreateTodoPayload, UpdateTodoPayload, TodoPriority, TodoStatus } from "../types";
import { useTodoStore } from "../store/todoStore";

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Finance", "Study", "Home"];

const TodoModal = ({ isOpen, onClose, editTodo }: TodoModalProps) => {
  const { createTodo, updateTodo } = useTodoStore();
  const isEdit = !!editTodo;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TodoStatus>("pending");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editTodo) {
        setTitle(editTodo.title);
        setDescription(editTodo.description);
        setStatus(editTodo.status);
        setPriority(editTodo.priority);
        setDueDate(editTodo.dueDate ? editTodo.dueDate.split("T")[0] : "");
        setCategory(editTodo.category || "");
        setCustomCategory("");
      } else {
        setTitle("");
        setDescription("");
        setStatus("pending");
        setPriority("medium");
        setDueDate("");
        setCategory("");
        setCustomCategory("");
      }
    }
  }, [isOpen, editTodo]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    const finalCategory = customCategory.trim() || category;

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
        };
        await updateTodo(editTodo._id, payload);
        toast.success("Todo updated! ✨");
      } else {
        const payload: CreateTodoPayload = {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate || undefined,
          category: finalCategory || undefined,
        };
        await createTodo(payload);
        toast.success("Todo created! 🎉");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const priorityOptions: { value: TodoPriority; label: string; color: string }[] = [
    { value: "low", label: "Low", color: "#22c55e" },
    { value: "medium", label: "Medium", color: "#f59e0b" },
    { value: "high", label: "High", color: "#ef4444" },
    { value: "urgent", label: "Urgent 🔥", color: "#dc2626" },
  ];

  const statusOptions: { value: TodoStatus; label: string; color: string }[] = [
    { value: "pending", label: "Pending", color: "#f59e0b" },
    { value: "in-progress", label: "In Progress", color: "#3b82f6" },
    { value: "completed", label: "Completed", color: "#10b981" },
  ];

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
              maxWidth: 520,
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--color-text-primary)",
                    marginBottom: 2,
                  }}
                >
                  {isEdit ? "Edit Todo" : "Create New Todo"}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)" }}>
                  {isEdit ? "Update the details below." : "Fill in the details for your new task."}
                </p>
              </div>
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

            {/* Form Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {/* Title */}
              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  id="todo-title"
                  type="text"
                  placeholder="What needs to be done?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description *</label>
                <textarea
                  id="todo-description"
                  placeholder="Add more details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    minHeight: 80,
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Priority */}
              <div>
                <label style={labelStyle}>Priority</label>
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
                        background:
                          priority === opt.value ? `${opt.color}18` : "transparent",
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
                  <label style={labelStyle}>Status</label>
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
                          background:
                            status === opt.value ? `${opt.color}18` : "transparent",
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
                <label style={labelStyle}>Due Date (optional)</label>
                <input
                  id="todo-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{
                    ...inputStyle,
                    colorScheme: "dark",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              {/* Category */}
              <div>
                <label style={labelStyle}>Category (optional)</label>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setCategory(cat === category ? "" : cat);
                        setCustomCategory("");
                      }}
                      style={{
                        padding: "5px 12px",
                        borderRadius: 999,
                        fontSize: "0.78rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        border: `1px solid ${category === cat ? "rgba(124,58,237,0.5)" : "rgba(255,255,255,0.08)"}`,
                        background:
                          category === cat ? "rgba(124,58,237,0.15)" : "transparent",
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
                  placeholder="Or type a custom category..."
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    if (e.target.value) setCategory("");
                  }}
                  style={inputStyle}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.6)";
                    e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(124,58,237,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                gap: 10,
                marginTop: 28,
                paddingTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: "12px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  color: "var(--color-text-secondary)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                }}
              >
                Cancel
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
                  background: isLoading
                    ? "rgba(124,58,237,0.5)"
                    : "linear-gradient(135deg, #7c3aed, #9333ea)",
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
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                      style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }}
                    />
                    Saving...
                  </>
                ) : isEdit ? (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    Create Todo
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TodoModal;
