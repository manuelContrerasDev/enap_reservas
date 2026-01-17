import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";

interface SnackbarProps {
  message: string;
  type?: "success" | "error";
  show: boolean;
  onClose: () => void;
}

const Snackbar: React.FC<SnackbarProps> = ({ message, type = "success", show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  const bgColor = type === "success" ? "bg-[#00796B]" : "bg-red-600";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4 }}
          className={`fixed bottom-6 right-6 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50`}
        >
          {type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Snackbar;
