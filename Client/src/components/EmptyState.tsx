import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAdd: () => void;
  isFiltered?: boolean;
}

const EmptyState = ({ onAdd, isFiltered = false }: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 32px",
        textAlign: "center",
      }}
    >
      {/* Animated SVG Illustration */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ marginBottom: 32 }}
      >
        <svg width={160} height={140} viewBox="0 0 160 140" fill="none">
          {/* Shadow */}
          <ellipse cx={80} cy={128} rx={45} ry={8} fill="rgba(124,58,237,0.08)" />
          {/* Clipboard body */}
          <rect x={30} y={18} width={100} height={100} rx={14} fill="rgba(20,16,48,0.9)" stroke="rgba(124,58,237,0.25)" strokeWidth={1.5} />
          {/* Clipboard clip */}
          <rect x={60} y={10} width={40} height={20} rx={6} fill="rgba(30,24,60,0.95)" stroke="rgba(124,58,237,0.3)" strokeWidth={1.5} />
          {/* Lines */}
          <rect x={45} y={45} width={70} height={6} rx={3} fill="rgba(124,58,237,0.15)" />
          <rect x={45} y={62} width={50} height={6} rx={3} fill="rgba(124,58,237,0.1)" />
          <rect x={45} y={79} width={60} height={6} rx={3} fill="rgba(124,58,237,0.1)" />
          <rect x={45} y={96} width={40} height={6} rx={3} fill="rgba(124,58,237,0.08)" />
          {/* Plus icon */}
          <circle cx={120} cy={105} r={18} fill="rgba(124,58,237,0.15)" stroke="rgba(124,58,237,0.4)" strokeWidth={1.5} />
          <line x1={120} y1={98} x2={120} y2={112} stroke="#a78bfa" strokeWidth={2.5} strokeLinecap="round" />
          <line x1={113} y1={105} x2={127} y2={105} stroke="#a78bfa" strokeWidth={2.5} strokeLinecap="round" />
          {/* Sparkles */}
          <motion.g
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: "25px 30px" }}
          >
            <circle cx={22} cy={28} r={3} fill="#f5c842" opacity={0.7} />
          </motion.g>
          <motion.g
            animate={{ opacity: [0.3, 0.9, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
            style={{ transformOrigin: "140px 40px" }}
          >
            <circle cx={140} cy={38} r={2.5} fill="#a78bfa" opacity={0.7} />
          </motion.g>
          <motion.g
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            <circle cx={18} cy={85} r={2} fill="#3b82f6" opacity={0.5} />
          </motion.g>
        </svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          fontSize: "1.4rem",
          fontWeight: 700,
          color: "var(--color-text-primary)",
          marginBottom: 10,
        }}
      >
        {isFiltered ? "No matching todos" : "No todos yet!"}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontSize: "0.95rem",
          color: "var(--color-text-muted)",
          maxWidth: 300,
          lineHeight: 1.6,
          marginBottom: 28,
        }}
      >
        {isFiltered
          ? "Try adjusting your filters or search term."
          : "Start organizing your life. Create your first task and stay on top of everything that matters."}
      </motion.p>

      {!isFiltered && (
        <motion.button
          id="empty-state-add"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            background: "linear-gradient(135deg, #7c3aed, #9333ea)",
            border: "none",
            borderRadius: 12,
            color: "white",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            fontFamily: "var(--font-family)",
          }}
        >
          <Plus size={18} />
          Create First Todo
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
