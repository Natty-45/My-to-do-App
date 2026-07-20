import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton = ({ onClick }: FloatingButtonProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      style={{
        position: "fixed",
        bottom: 32,
        right: 32,
        zIndex: 30,
      }}
    >
      {/* Tooltip */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: 10, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "absolute",
              right: "calc(100% + 12px)",
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(10, 8, 28, 0.95)",
              border: "1px solid rgba(124,58,237,0.3)",
              borderRadius: 10,
              padding: "8px 14px",
              fontSize: "0.83rem",
              fontWeight: 600,
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            }}
          >
            New Todo
            {/* Arrow */}
            <div
              style={{
                position: "absolute",
                right: -5,
                top: "50%",
                transform: "translateY(-50%) rotate(45deg)",
                width: 8,
                height: 8,
                background: "rgba(10, 8, 28, 0.95)",
                border: "1px solid rgba(124,58,237,0.3)",
                borderLeft: "none",
                borderBottom: "none",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ripple ring */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1.5],
          opacity: [0.5, 0, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: "50%",
          border: "2px solid rgba(124,58,237,0.4)",
          pointerEvents: "none",
        }}
      />

      {/* Button */}
      <motion.button
        id="fab-add-todo"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        onClick={onClick}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #7c3aed, #9333ea)",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(124,58,237,0.5), 0 0 0 2px rgba(124,58,237,0.2)",
          color: "white",
          position: "relative",
        }}
      >
        <motion.div
          animate={{ rotate: hovered ? 45 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.div>
      </motion.button>
    </motion.div>
  );
};

export default FloatingButton;
