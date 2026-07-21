import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import StatsBar from "../components/StatsBar";
import FilterBar from "../components/FilterBar";
import TodoCard from "../components/TodoCard";
import EmptyState from "../components/EmptyState";
import FloatingButton from "../components/floatingButton";
import TodoModal from "../components/TodoModal";
import CollectionSidebar from "../components/CollectionSidebar";
import CollectionManager from "../components/CollectionManager";
import AITodoGenerator from "../components/AITodoGenerator";
import { useTodoStore } from "../store/todoStore";
import { useCollectionStore } from "../store/collectionStore";
import type { Todo } from "../types";
import toast from "react-hot-toast";

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const { todos, isLoading, error, fetchTodos, clearError, filters, setFilter } = useTodoStore();
  const { collections, fetchCollections, selectedCollectionId, setSelectedCollection } = useCollectionStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollectionManagerOpen, setIsCollectionManagerOpen] = useState(false);
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetchTodos();
    fetchCollections();
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error]);

  // Fetch todos when collection filter changes
  useEffect(() => {
    setFilter({ collectionId: selectedCollectionId });
    fetchTodos();
  }, [selectedCollectionId]);

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

  const handleCollectionSelect = (id: string | "all" | "none") => {
    setSelectedCollection(id);
  };

  const isFiltered =
    filters.status !== "all" ||
    filters.priority !== "all" ||
    filters.search !== "" ||
    filters.collectionId !== "all";

  const SkeletonCard = () => (
    <div style={{ background: "rgba(15, 12, 35, 0.6)", borderRadius: 16, padding: "18px 20px", border: "1px solid rgba(124,58,237,0.08)" }}>
      <div style={{ height: 18, width: "60%", borderRadius: 8, background: "linear-gradient(90deg, rgba(124,58,237,0.08) 0%, rgba(124,58,237,0.15) 50%, rgba(124,58,237,0.08) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 10 }} />
      <div style={{ height: 12, width: "85%", borderRadius: 6, background: "linear-gradient(90deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.1) 50%, rgba(124,58,237,0.05) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 6 }} />
      <div style={{ height: 12, width: "50%", borderRadius: 6, background: "linear-gradient(90deg, rgba(124,58,237,0.05) 0%, rgba(124,58,237,0.1) 50%, rgba(124,58,237,0.05) 100%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", marginBottom: 16 }} />
      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ height: 22, width: 70, borderRadius: 999, background: "rgba(124,58,237,0.08)", animation: "shimmer 1.5s infinite" }} />
        <div style={{ height: 22, width: 55, borderRadius: 999, background: "rgba(124,58,237,0.06)", animation: "shimmer 1.5s infinite" }} />
      </div>
    </div>
  );

  // Get active collection name
  const getActiveCollectionName = () => {
    if (selectedCollectionId === "all") return t("home.allTasks");
    if (selectedCollectionId === "none") return t("collection.uncategorized");
    const col = collections.find((c) => c._id === selectedCollectionId);
    return col ? col.name : t("home.allTasks");
  };

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

      {/* Main layout with sidebar */}
      <div style={{ display: "flex", flex: 1, position: "relative", zIndex: 1 }}>
        {/* Collection Sidebar */}
        <CollectionSidebar
          collections={collections}
          selectedId={selectedCollectionId}
          onSelect={handleCollectionSelect}
          onCreateClick={() => setIsCollectionManagerOpen(true)}
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Main content */}
        <main
          style={{
            flex: 1,
            maxWidth: 900,
            width: "100%",
            margin: "0 auto",
            padding: "28px 20px 100px",
            overflow: "hidden",
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
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
                  {getActiveCollectionName()}
                </h1>
                {selectedCollectionId !== "all" && selectedCollectionId !== "none" && (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-text-muted)",
                      background: "rgba(124,58,237,0.08)",
                      padding: "2px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(124,58,237,0.15)",
                    }}
                  >
                    {todos.length} {todos.length === 1 ? "task" : "tasks"}
                  </span>
                )}
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)" }}>
                {new Date().toLocaleDateString(i18n.language || "en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              {/* AI Generator Button */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setIsAIGeneratorOpen(true)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  background: "rgba(245,200,66,0.12)",
                  border: "1px solid rgba(245,200,66,0.3)",
                  borderRadius: 10,
                  color: "#f5c842",
                  fontSize: "0.83rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font-family)",
                }}
              >
                <Sparkles size={14} />
                AI
              </motion.button>

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
                {t("home.refresh")}
              </motion.button>
            </div>
          </motion.div>

          {/* Stats Bar */}
          <StatsBar todos={todos} />

          {/* Filter Bar */}
          <FilterBar />

          {/* Todo List */}
          {isLoading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : todos.length === 0 ? (
            <EmptyState onAdd={handleOpenCreate} isFiltered={isFiltered} />
          ) : (
            <motion.div
              layout
              style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}
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
      </div>

      {/* FAB */}
      <FloatingButton onClick={handleOpenCreate} />

      {/* Create/Edit Modal */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTodo={editTodo}
      />

      {/* Collection Manager Modal */}
      <CollectionManager
        isOpen={isCollectionManagerOpen}
        onClose={() => {
          setIsCollectionManagerOpen(false);
          fetchCollections();
        }}
      />

      {/* AI Todo Generator Modal */}
      <AITodoGenerator
        isOpen={isAIGeneratorOpen}
        onClose={() => setIsAIGeneratorOpen(false)}
      />
    </div>
  );
};

export default HomePage;
