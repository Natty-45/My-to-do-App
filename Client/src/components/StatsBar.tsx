import { motion } from "framer-motion";
import type { Todo } from "../types";
import { CheckCircle2, Clock, Zap, ListTodo } from "lucide-react";

interface StatsBarProps {
  todos: Todo[];
}

const StatsBar = ({ todos }: StatsBarProps) => {
  const total = todos.length;
  const completed = todos.filter((t) => t.status === "completed").length;
  const inProgress = todos.filter((t) => t.status === "in-progress").length;
  const pending = todos.filter((t) => t.status === "pending").length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Total",
      value: total,
      icon: <ListTodo size={18} />,
      color: "#a78bfa",
      bg: "rgba(167, 139, 250, 0.1)",
      border: "rgba(167, 139, 250, 0.2)",
    },
    {
      label: "Pending",
      value: pending,
      icon: <Clock size={18} />,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
      border: "rgba(245, 158, 11, 0.2)",
    },
    {
      label: "In Progress",
      value: inProgress,
      icon: <Zap size={18} />,
      color: "#3b82f6",
      bg: "rgba(59, 130, 246, 0.1)",
      border: "rgba(59, 130, 246, 0.2)",
    },
    {
      label: "Completed",
      value: completed,
      icon: <CheckCircle2 size={18} />,
      color: "#10b981",
      bg: "rgba(16, 185, 129, 0.1)",
      border: "rgba(16, 185, 129, 0.2)",
    },
  ];

  // SVG circle progress
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionRate / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      {/* Progress ring */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(12, 10, 28, 0.7)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(124, 58, 237, 0.15)",
          borderRadius: 16,
          padding: "16px 20px",
          gap: 14,
          minWidth: 160,
        }}
      >
        <div style={{ position: "relative", width: 72, height: 72 }}>
          <svg width={72} height={72} style={{ transform: "rotate(-90deg)" }}>
            {/* Background track */}
            <circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke="rgba(124, 58, 237, 0.15)"
              strokeWidth={6}
            />
            {/* Progress */}
            <motion.circle
              cx={36}
              cy={36}
              r={radius}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: "var(--color-text-primary)",
                lineHeight: 1,
              }}
            >
              {completionRate}%
            </motion.span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: 2 }}>
            Completed
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
            {completed}/{total}
          </div>
        </div>
      </motion.div>

      {/* Individual stat cards */}
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 + idx * 0.07 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(12, 10, 28, 0.7)",
            backdropFilter: "blur(16px)",
            border: `1px solid ${stat.border}`,
            borderRadius: 16,
            padding: "14px 18px",
            flex: 1,
            minWidth: 110,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
              borderRadius: 10,
              background: stat.bg,
              color: stat.color,
              flexShrink: 0,
            }}
          >
            {stat.icon}
          </div>
          <div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {stat.label}
            </div>
            <motion.div
              key={stat.value}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{
                fontSize: "1.6rem",
                fontWeight: 800,
                color: stat.color,
                lineHeight: 1,
              }}
            >
              {stat.value}
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsBar;
