import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, CheckCircle } from "lucide-react";
import { GlassCard } from "./GlassCard";

import { encryptUint64 } from "../fhevm/encrypt";
import { getLoanVaultContract } from "../contracts/loanVault";
import { ethers } from "ethers";

interface BorrowRepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ethers.BrowserProvider | null;
}

export function BorrowRepayModal({
  isOpen,
  onClose,
  provider
}: BorrowRepayModalProps) {
  const [mode, setMode] = useState<"borrow" | "repay">("borrow");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorStatus(null);

    if (!provider) {
      return setErrorStatus("Wallet not connected.");
    }

    const floatAmount = Number(amount);
    if (floatAmount <= 0) {
      return setErrorStatus("Invalid amount.");
    }

    setIsProcessing(true);

    try {
      // Encrypt amount
      const encrypted = await encryptUint64(floatAmount);

      // Connect to LoanVault
      const vault = getLoanVaultContract(provider);

      let tx;
      if (mode === "borrow") {
        tx = await vault.borrow(encrypted.handles[0]);
      } else {
        tx = await vault.repay(encrypted.handles[0]);
      }

      await tx.wait();

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAmount("");
        onClose();
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setErrorStatus("Transaction failed: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Manage Loan</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!isSuccess ? (
                <>
                  {/* Mode Switch */}
                  <div className="flex gap-2 p-1 bg-black/40 rounded-lg mb-6">
                    <button
                      onClick={() => setMode("borrow")}
                      className={`flex-1 py-2 rounded-md ${
                        mode === "borrow"
                          ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                          : "hover:bg-white/5"
                      }`}
                    >
                      Borrow
                    </button>
                    <button
                      onClick={() => setMode("repay")}
                      className={`flex-1 py-2 rounded-md ${
                        mode === "repay"
                          ? "bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                          : "hover:bg-white/5"
                      }`}
                    >
                      Repay
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    {/* Amount Input */}
                    <div className="mb-6">
                      <label className="block text-sm text-[#9CA3AF] mb-2">
                        Amount
                      </label>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-lg"
                        required
                      />
                    </div>

                    {/* Errors */}
                    {errorStatus && (
                      <div className="mb-4 p-3 bg-red-600/20 text-red-400 rounded-lg">
                        {errorStatus}
                      </div>
                    )}

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isProcessing || !amount}
                      className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] rounded-lg flex items-center justify-center"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Submit ${mode === "borrow" ? "Borrow" : "Repay"}`
                      )}
                    </motion.button>
                  </form>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h3 className="text-2xl mt-4">Success!</h3>
                </motion.div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
