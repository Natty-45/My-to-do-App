import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const Auth: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const clientName: string = import.meta.env.VITE_CLIENT_NAME || "Natty";

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (password === "secret123") {
      toast.success("Login successful! ");
      // Here you could navigate or trigger auth logic
    }
    else if (password !== "") {
        toast.error("Incorrect password. Please try again.");
        setPassword(""); // Clear the password input
        return;
    }
    else {
        toast.error("Please enter a password.");
        return;
    }
    // If incorrect: do nothing (no error toast)
  };

  return (
    <div className="h-full w-full flex items-center justify-center px-4">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2.5, ease: "easeInOut" }}
        className="w-full max-w-md p-8 rounded-2xl bg-black/40 border border-yellow-200/20 shadow-xl backdrop-blur-[16px] text-white"
      >
        <motion.div
          initial={{ y: 0, scale: 1, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-2 drop-shadow-md bg-gradient-to-r from-yellow-500 via-white to-yellow-500 bg-clip-text text-transparent">
            Welcome to My To‑Do App
          </h1>
          <p className="text-lg opacity-90 bg-gradient-to-r from-white via-gold-300 to-white bg-clip-text text-transparent">
            Track your tasks Effieciently ✨
          </p>
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 2.5, delay: 0.3 }}
            className="mt-20"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gold-300">
              Hello {clientName} 👋
            </h2>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-yellow-200/20 text-yellow-200 placeholder-yellow-100 border border-yellow-200/30 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 backdrop-blur-lg"
            />
            <button
              onClick={handleSubmit}
              className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md font-medium transition duration-300"
            >
              Login
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Auth;
