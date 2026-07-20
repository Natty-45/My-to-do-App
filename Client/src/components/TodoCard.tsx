import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  Edit3,
  Calendar,
  Tag,
  ChevronRight,
  CheckCircle2,
  Clock,
  Zap,
  AlertCircle,
} from "lucide-react";
import type { Todo, TodoPriority, TodoStatus } from "../types";
import { useTodoStore } from "../store/todoStore";
import toast from "react-hot-toast";
import { useState } from "react";

interface TodoCardProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  index: number;
}

const priorityConfig: Record<
  TodoPriority,
  { label: string; color: string; bg: string; border: string }
> = {
  low: {
    label: "Low",
    color: "#22c55e",
    bg: "rgba(34,197,94,0.1)",
    border: "rgba(34,197,94,0.25)",
  },
  medium: {
    label: "Medium",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.25)",
  },
  high: {
    label: "High",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
  },
  urgent: {
    label: "Urgent",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.15)",
    border: "rgba(220,38,38,0.4)",
  },
};

const statusConfig: Record<
  TodoStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode; next: TodoStatus }
> = {
  pending: {
    label: "Pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    icon: <Clock size={12} />,
    next: "in-progress",
  },
  "in-progress": {
    label: "In Progress",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.12)",
    icon: <Zap size={12} />,
    next: "completed",
  },
  completed: {
    label: "Completed",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
    icon: <CheckCircle2 size={12} />,
    next: "pending",
  },
};

const isOverdue = (dueDate?: string, status?: TodoStatus): boolean => {
  if (!dueDate || status === "completed") return false;
  return new Date(dueDate) < new Date();
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff <= 7) return `${diff}d left`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const TodoCard = ({ todo, onEdit, index }: TodoCardProps) => {
  const { deleteTodo, updateTodo } = useTodoStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const priority = priorityConfig[todo.priority];
  const status = statusConfig[todo.status];
  const overdue = isOverdue(todo.dueDate, todo.status);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTodo(todo._id);
      toast.success("Todo deleted.");
    } catch {
      toast.error("Failed to delete todo.");
      setIsDeleting(false);
    }
  };

  const handleStatusCycle = async () => {
    if (isUpdatingStatus) return;
    setIsUpdatingStatus(true);
    try {
      await updateTodo(todo._id, { status: status.next });
      toast.success(
        status.next === "completed"
          ? "🎉 Task completed!"
          : `Moved to ${statusConfig[status.next].label}`
      );
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: isDeleting ? 0 : 1, y: 0, scale: isDeleting ? 0.9 : 1, height: isDeleting ? 0 : "auto" }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: "relative",
        background: "var(--gradient-card)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${overdue ? "rgba(239,68,68,0.35)" : "rgba(124,58,237,0.12)"}`,
        borderRadius: 16,
        padding: "18px 20px",
        cursor: "default",
        overflow: "hidden",
        boxShadow: overdue
          ? "0 4px 20px rgba(239,68,68,0.12)"
          : "0 4px 20px rgba(0,0,0,0.2)",
        opacity: todo.status === "completed" ? 0.75 : 1,
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
      }}
      whileHover={{
        boxShadow: overdue
          ? "0 8px 32px rgba(239,68,68,0.2)"
          : "0 8px 32px rgba(124,58,237,0.18)",
        borderColor: overdue ? "rgba(239,68,68,0.5)" : "rgba(124,58,237,0.3)",
      }}
    >
      {/* Priority accent bar on left */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          borderRadius: "16px 0 0 16px",
          background: priority.color,
          opacity: todo.status === "completed" ? 0.4 : 1,
        }}
      />

      {/* Completed overlay strikethrough effect */}
      {todo.status === "completed" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(16, 185, 129, 0.03)",
            borderRadius: 16,
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ paddingLeft: 8 }}>
        {/* Top row: title + actions */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 8,
          }}
        >
          <h3
            style={{
              fontSize: "0.98rem",
              fontWeight: 650,
              color: "var(--color-text-primary)",
              lineHeight: 1.4,
              textDecoration: todo.status === "completed" ? "line-through" : "none",
              opacity: todo.status === "completed" ? 0.7 : 1,
              flex: 1,
              wordBreak: "break-word",
            }}
          >
            {todo.title}
          </h3>

          {/* Action buttons — always visible */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEdit(todo)}
              title="Edit"
              style={{
                background: "rgba(167,139,250,0.1)",
                border: "1px solid rgba(167,139,250,0.2)",
                borderRadius: 8,
                padding: "6px 7px",
                cursor: "pointer",
                color: "#a78bfa",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Edit3 size={14} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
              disabled={isDeleting}
              title="Delete"
              style={{
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
                borderRadius: 8,
                padding: "6px 7px",
                cursor: "pointer",
                color: "#ef4444",
                display: "flex",
                alignItems: "center",
              }}
            >
              {isDeleting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                  style={{ width: 14, height: 14, border: "2px solid #ef4444", borderTopColor: "transparent", borderRadius: "50%" }}
                />
              ) : (
                <Trash2 size={14} />
              )}
            </motion.button>
          </div>
        </div>

        {/* Description */}
        {todo.description && (
          <p
            style={{
              fontSize: "0.84rem",
              color: "var(--color-text-muted)",
              lineHeight: 1.5,
              marginBottom: 12,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {todo.description}
          </p>
        )}

        {/* Badges row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          {/* Status badge — clickable to cycle */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStatusCycle}
            disabled={isUpdatingStatus}
            title={`Advance to ${statusConfig[status.next].label}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: "0.72rem",
              fontWeight: 600,
              background: status.bg,
              color: status.color,
              border: `1px solid ${status.color}40`,
              cursor: "pointer",
              fontFamily: "var(--font-family)",
              transition: "all 0.15s ease",
            }}
          >
            {isUpdatingStatus ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                style={{ width: 10, height: 10, border: `2px solid ${status.color}`, borderTopColor: "transparent", borderRadius: "50%" }}
              />
            ) : (
              status.icon
            )}
            {status.label}
            {!isUpdatingStatus && <ChevronRight size={10} />}
          </motion.button>

          {/* Priority badge */}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 3,
              padding: "4px 10px",
              borderRadius: 999,
              fontSize: "0.72rem",
              fontWeight: 600,
              background: priority.bg,
              color: priority.color,
              border: `1px solid ${priority.border}`,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            {todo.priority === "urgent" && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <AlertCircle size={10} />
              </motion.span>
            )}
            {priority.label}
          </span>

          {/* Category */}
          {todo.category && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 500,
                background: "rgba(124,58,237,0.08)",
                color: "var(--color-text-secondary)",
                border: "1px solid rgba(124,58,237,0.15)",
              }}
            >
              <Tag size={10} />
              {todo.category}
            </span>
          )}

          {/* Due date */}
          {todo.dueDate && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                padding: "4px 10px",
                borderRadius: 999,
                fontSize: "0.72rem",
                fontWeight: 500,
                background: overdue ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)",
                color: overdue ? "#ef4444" : "var(--color-text-muted)",
                border: `1px solid ${overdue ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              <Calendar size={10} />
              {formatDate(todo.dueDate)}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TodoCard;
