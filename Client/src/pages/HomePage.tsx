import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Navbar from "../components/Navbar";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import TodoCard from "../components/TodoCard";
import EmptyState from "../components/EmptyState";
import FloatingButton from "../components/floatingButton";
import TodoModal from "../components/TodoModal";
import { useTodoStore } from "../store/todoStore";
import type { Todo } from "../types";
import toast from "react-hot-toast";

const HomePage = () => {
  const { todos, isLoading, error, fetchTodos, clearError, filters } = useTodoStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  const handleOpenCreate = () => {
    setEditTodo(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (todo: Todo) => {
    setEditTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTodo(null);
  };

  const isFiltered =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.search !== "";

  const SkeletonCard = () => (
    <div
      style={{
        background: "rgba(15, 12, 35, 0.6)",
        borderRadius: 16,
        padding: "18px 20px",
        border: "1px solid rgba(124,58,237,0.08)",
      }}
    >
      <div
        style={{
          height: 18,
          width: "60%",
          borderRadius: 8,
          background: "linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.15) 50%, rgba(124,58,237,0.08) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          marginBottom: 10,
        }}
      />
      <div
        style={{
          height: 12,
          width: "85%",
          borderRadius: 6,
          background: "linear-gradient(90deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.1) 50%, rgba(124,58,237,0.05) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          marginBottom: 6,
        }}
      />
      <div
        style={{
          height: 12,
          width: "50%",
          borderRadius: 6,
          background: "linear-gradient(90deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.1) 50%, rgba(124,58,237,0.05) 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
          marginBottom: 16,
        }}
      />
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ height: 22, width: 70, borderRadius: 999, background: "rgba(124,58,237,0.08)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 22, width: 55, borderRadius: 999, background: "rgba(124,58,237,0.06)", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background mesh */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(124, 58, 237, 0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(245, 200, 66, 0.04) 0%, transparent 50%)",
        }}
      />

      {/* Sticky Navbar */}
      <Navbar />

      {/* Main content */}
      <main
        style={{
          position: "relative",
          zIndex: 1,
          flex: 1,
          maxWidth: 900,
          width: "100%",
          margin: "0 auto",
          padding: "28px 20px 100px",
        }}
      >
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "1.8rem",
                fontWeight: 800,
                lineHeight: 1.2,
                background: "linear-gradient(135deg, var(--color-text-primary), var(--color-accent-violet-light))",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 4,
              }}
            >
              My Tasks
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fetchTodos()}
            disabled={isLoading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 16px",
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
              borderRadius: 10,
              color: "var(--color-text-secondary)",
              fontSize: "0.83rem",
              fontWeight: 500,
              cursor: "pointer",
              fontFamily: "var(--font-family)",
            }}
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
              transition={isLoading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            >
              <RefreshCw size={14} />
            </motion.div>
            Refresh
          </motion.button>
        </motion.div>

        {/* Stats Bar */}
        <StatsBar todos={todos} />

        {/* Filter Bar */}
        <FilterBar />

        {/* Todo List */}
        {isLoading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : todos.length === 0 ? (
          <EmptyState onAdd={handleOpenCreate} isFiltered={isFiltered} />
        ) : (
          <motion.div
            layout
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 14,
            }}
          >
            <AnimatePresence mode="popLayout">
              {todos.map((todo, index) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onEdit={handleOpenEdit}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* FAB */}
      <FloatingButton onClick={handleOpenCreate} />

      {/* Create/Edit Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTodo={editTodo}
      />
    </div>
  );
};

export default HomePage;