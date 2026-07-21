import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { useCollectionStore } from "../store/collectionStore";
import type { Collection } from "../types";

const COLLECTION_COLORS = [
  "#7c3aed", // violet
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#22c55e", // lime
];

interface CollectionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  editCollection?: Collection | null;
}

const CollectionManager = ({ isOpen, onClose, editCollection }: CollectionManagerProps) => {
  const { t } = useTranslation();
  const { createCollection, updateCollection, deleteCollection, collections, fetchCollections } = useCollectionStore();
  const isEdit = !!editCollection;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLLECTION_COLORS[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (editCollection) {
        setName(editCollection.name);
        setDescription(editCollection.description || "");
        setColor(editCollection.color || COLLECTION_COLORS[0]);
      } else {
        setName("");
        setDescription("");
        setColor(COLLECTION_COLORS[0]);
      }
      setShowDeleteConfirm(false);
    }
  }, [isOpen, editCollection]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Collection name is required.");
      return;
    }

    setIsLoading(true);
    try {
      if (isEdit && editCollection) {
        await updateCollection(editCollection._id, {
          name: name.trim(),
          description: description.trim() || undefined,
          color,
        });
        toast.success(t("collection.updated"));
      } else {
        await createCollection({
          name: name.trim(),
          description: description.trim() || undefined,
          color,
        });
        toast.success(t("collection.created"));
      }
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editCollection) return;
    setIsLoading(true);
    try {
      await deleteCollection(editCollection._id);
      toast.success(t("collection.deleted"));
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    } finally {
      setIsLoading(false);
    }
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
    transition: "border-color 0.2s ease",
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
            zIndex: 60,
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
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 420,
              background: "rgba(10, 8, 28, 0.97)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(124,58,237,0.25)",
              borderRadius: 20,
              padding: "28px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-text-primary)" }}>
                {isEdit ? t("collection.edit") : t("collection.create")}
              </h2>
              <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: 8, cursor: "pointer", color: "var(--color-text-muted)", display: "flex" }}>
                <X size={18} />
              </motion.button>
            </div>

            {/* Form */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={labelStyle}>{t("collection.name")}</label>
                <input
                  type="text"
                  placeholder={t("collection.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label style={labelStyle}>{t("collection.description")}</label>
                <textarea
                  placeholder={t("collection.descriptionPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical", minHeight: 60 }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.6)"; e.target.style.boxShadow = "0 0 0 3px rgba(124,58,237,0.12)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(124,58,237,0.2)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <div>
                <label style={labelStyle}>{t("collection.color")}</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {COLLECTION_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        background: c,
                        border: color === c ? "2px solid white" : "2px solid transparent",
                        cursor: "pointer",
                        boxShadow: color === c ? `0 0 12px ${c}80` : "none",
                        transition: "all 0.15s ease",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {isEdit && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDeleteConfirm(true)}
                  style={{
                    padding: "12px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 12,
                    color: "#ef4444",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "var(--font-family)",
                    fontSize: "0.9rem",
                  }}
                >
                  <Trash2 size={16} />
                </motion.button>
              )}
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
                {t("common.cancel")}
              </motion.button>
              <motion.button
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
                }}
              >
                {isLoading ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%" }} />
                ) : (
                  <><Save size={16} /> {isEdit ? t("common.save") : t("collection.create")}</>
                )}
              </motion.button>
            </div>

            {/* Delete confirmation */}
            <AnimatePresence>
              {showDeleteConfirm && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  style={{
                    marginTop: 16,
                    padding: 16,
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    borderRadius: 12,
                  }}
                >
                  <p style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: 12, fontWeight: 500 }}>
                    {t("collection.deleteConfirm")}
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setShowDeleteConfirm(false)} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "var(--color-text-secondary)", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: "0.85rem" }}>
                      {t("common.cancel")}
                    </button>
                    <button onClick={handleDelete} disabled={isLoading} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.2)", border: "1px solid #ef4444", color: "#ef4444", cursor: "pointer", fontFamily: "var(--font-family)", fontSize: "0.85rem", fontWeight: 600 }}>
                      {isLoading ? t("common.loading") : t("common.delete")}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CollectionManager;
