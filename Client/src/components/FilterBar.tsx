import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { FilterState, TodoPriority, TodoStatus } from "../types";
import { useTodoStore } from "../store/todoStore";
import { useEffect, useRef } from "react";

const FilterBar = () => {
  const { filters, setFilter, fetchTodos } = useTodoStore();
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const statusOptions: { label: string; value: TodoStatus | "all" }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "In Progress", value: "in-progress" },
    { label: "Completed", value: "completed" },
  ];

  const priorityOptions: { label: string; value: TodoPriority | "all" }[] = [
    { label: "All Priority", value: "all" },
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
    { label: "Urgent", value: "urgent" },
  ];

  const sortOptions: { label: string; value: FilterState["sortBy"] }[] = [
    { label: "Newest First", value: "createdAt" },
    { label: "Due Date", value: "dueDate" },
    { label: "Priority", value: "priority" },
    { label: "Title A-Z", value: "title" },
  ];

  const handleSearchChange = (value: string) => {
    setFilter({ search: value });
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      fetchTodos();
    }, 400);
  };

  const handleStatusChange = (value: TodoStatus | "all") => {
    setFilter({ status: value });
    setTimeout(() => fetchTodos(), 0);
  };

  const handlePriorityChange = (value: TodoPriority | "all") => {
    setFilter({ priority: value });
    setTimeout(() => fetchTodos(), 0);
  };

  const handleSortChange = (value: FilterState["sortBy"]) => {
    setFilter({ sortBy: value });
    setTimeout(() => fetchTodos(), 0);
  };

  const handleClearSearch = () => {
    setFilter({ search: "" });
    setTimeout(() => fetchTodos(), 0);
  };

  const pillStyle = (active: boolean, color?: string) => ({
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: "0.8rem",
    fontWeight: 500,
    cursor: "pointer",
    border: active
      ? `1px solid ${color || "rgba(124,58,237,0.6)"}`
      : "1px solid rgba(255,255,255,0.08)",
    background: active
      ? color
        ? `${color}20`
        : "rgba(124,58,237,0.15)"
      : "transparent",
    color: active
      ? color || "#a78bfa"
      : "var(--color-text-muted)",
    transition: "all 0.15s ease",
    fontFamily: "var(--font-family)",
    whiteSpace: "nowrap" as const,
  });

  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    "in-progress": "#3b82f6",
    completed: "#10b981",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{ marginBottom: 20 }}
    >
      {/* Search Row */}
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search
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
        <input
          id="search-input"
          type="text"
          placeholder="Search todos..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(12, 10, 28, 0.6)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(124,58,237,0.15)",
            borderRadius: 12,
            padding: "11px 40px",
            fontSize: "0.9rem",
            color: "var(--color-text-primary)",
            outline: "none",
            transition: "border-color 0.2s ease",
            fontFamily: "var(--font-family)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.5)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(124,58,237,0.15)")}
        />
        {filters.search && (
          <button
            onClick={handleClearSearch}
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
              padding: 4,
            }}
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Filter pills row */}
      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            color: "var(--color-text-muted)",
            fontSize: "0.8rem",
            marginRight: 4,
          }}
        >
          <SlidersHorizontal size={13} />
          <span>Filter:</span>
        </div>

        {/* Status filters */}
        {statusOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleStatusChange(opt.value)}
            style={pillStyle(
              filters.status === opt.value,
              opt.value !== "all" ? statusColors[opt.value] : undefined
            )}
          >
            {opt.label}
          </button>
        ))}

        <div
          style={{
            width: 1,
            height: 20,
            background: "rgba(255,255,255,0.1)",
            margin: "0 4px",
          }}
        />

        {/* Priority filter */}
        <select
          id="priority-filter"
          value={filters.priority}
          onChange={(e) => handlePriorityChange(e.target.value as TodoPriority | "all")}
          style={{
            background: "rgba(12, 10, 28, 0.7)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            outline: "none",
            fontFamily: "var(--font-family)",
          }}
        >
          {priorityOptions.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#0f0f1a" }}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          id="sort-select"
          value={filters.sortBy}
          onChange={(e) => handleSortChange(e.target.value as FilterState["sortBy"])}
          style={{
            background: "rgba(12, 10, 28, 0.7)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: "0.8rem",
            color: "var(--color-text-secondary)",
            cursor: "pointer",
            outline: "none",
            fontFamily: "var(--font-family)",
          }}
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: "#0f0f1a" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
};

export default FilterBar;
