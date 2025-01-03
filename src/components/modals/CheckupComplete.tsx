import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface CheckupCompleteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckupComplete = ({ isOpen, onClose }: CheckupCompleteProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>

          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Today&apos;s Checkup Completed!
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              You&apos;ve already submitted your health checkup for today. Come back tomorrow!
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};