import { motion } from "framer-motion";
import { Folder, Plus, Layers, Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Collection } from "../types";

interface CollectionSidebarProps {
  collections: Collection[];
  selectedId: string | "all" | "none";
  onSelect: (id: string | "all" | "none") => void;
  onCreateClick: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const COLLECTION_ICONS: Record<string, React.ReactNode> = {
  folder: <Folder size={16} />,
};

const CollectionSidebar = ({
  collections,
  selectedId,
  onSelect,
  onCreateClick,
  isCollapsed,
  onToggle,
}: CollectionSidebarProps) => {
  const { t } = useTranslation();

  const itemStyle = (active: boolean) => ({
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 10,
    cursor: "pointer",
    background: active ? "rgba(124,58,237,0.15)" : "transparent",
    border: active
      ? "1px solid rgba(124,58,237,0.35)"
      : "1px solid transparent",
    color: active ? "#a78bfa" : "var(--color-text-secondary)",
    transition: "all 0.15s ease",
    width: "100%",
    textAlign: "left" as const,
    fontFamily: "var(--font-family)",
    fontSize: "0.85rem",
    fontWeight: active ? 600 : 500,
  });

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 60 : 240 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: "rgba(10, 8, 22, 0.6)",
        borderRight: "1px solid rgba(124,58,237,0.1)",
        backdropFilter: "blur(16px)",
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      <div style={{ padding: "16px 12px", flex: 1, overflowY: "auto" }}>
        {/* Toggle button */}
        <button
          onClick={onToggle}
          style={{
            background: "rgba(124,58,237,0.1)",
            border: "1px solid rgba(124,58,237,0.2)",
            borderRadius: 8,
            padding: "6px 8px",
            cursor: "pointer",
            color: "var(--color-text-muted)",
            marginBottom: 16,
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Layers size={16} />
        </button>

        {/* All Tasks */}
        {!isCollapsed && (
          <>
            <div
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                color: "var(--color-text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              {t("collection.title")}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
              <button
                onClick={() => onSelect("all")}
                style={itemStyle(selectedId === "all")}
                onMouseEnter={(e) => {
                  if (selectedId !== "all") {
                    e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== "all") {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Inbox size={16} />
                {t("collection.all")}
              </button>

              <button
                onClick={() => onSelect("none")}
                style={itemStyle(selectedId === "none")}
                onMouseEnter={(e) => {
                  if (selectedId !== "none") {
                    e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedId !== "none") {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                <Inbox size={16} />
                {t("collection.uncategorized")}
              </button>
            </div>
          </>
        )}

        {/* Collections list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {collections.map((col) => (
            <motion.button
              key={col._id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => onSelect(col._id)}
              style={{
                ...itemStyle(selectedId === col._id),
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                if (selectedId !== col._id) {
                  e.currentTarget.style.background = "rgba(124,58,237,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedId !== col._id) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* Color dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: col.color,
                  flexShrink: 0,
                  boxShadow: `0 0 6px ${col.color}60`,
                }}
              />
              {!isCollapsed && (
                <>
                  <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {col.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--color-text-muted)",
                      background: "rgba(255,255,255,0.05)",
                      padding: "1px 6px",
                      borderRadius: 999,
                    }}
                  >
                    {col.todoCount}
                  </span>
                </>
              )}
            </motion.button>
          ))}
        </div>

        {/* Create button */}
        {!isCollapsed && (
          <button
            onClick={onCreateClick}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              marginTop: 12,
              borderRadius: 10,
              cursor: "pointer",
              background: "rgba(124,58,237,0.08)",
              border: "1px dashed rgba(124,58,237,0.3)",
              color: "var(--color-text-secondary)",
              fontSize: "0.85rem",
              fontWeight: 500,
              width: "100%",
              textAlign: "left" as const,
              fontFamily: "var(--font-family)",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(124,58,237,0.15)";
              e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(124,58,237,0.08)";
              e.currentTarget.style.color = "var(--color-text-secondary)";
            }}
          >
            <Plus size={14} />
            {t("collection.create")}
          </button>
        )}
      </div>
    </motion.aside>
  );
};

export default CollectionSidebar;
