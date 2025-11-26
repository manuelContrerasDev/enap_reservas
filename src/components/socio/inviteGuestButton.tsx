import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, X } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

interface Props {
  onInvited?: () => void; 
}

const InviteGuestButton: React.FC<Props> = ({ onInvited }) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const token = localStorage.getItem("token");

      const resp = await fetch(`${API_URL}/api/guest/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, name }),
      });

      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Error al invitar usuario");

      setMsg("✔ Invitación enviada correctamente.");
      setEmail("");
      setName("");

      onInvited?.();
    } catch (err: any) {
      setMsg("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-[#002E3E] text-white rounded-lg shadow hover:bg-[#003B4D]"
      >
        <UserPlus size={18} />
        Invitar usuario externo
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>

              <h2 className="text-xl font-semibold text-[#002E3E] mb-4">
                Invitar Usuario Externo
              </h2>

              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-700">Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-[#002E3E]"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-700">Nombre (opcional)</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg focus:ring-[#002E3E]"
                  />
                </div>

                {msg && (
                  <p className="text-sm text-center font-medium text-[#002E3E]">
                    {msg}
                  </p>
                )}

                <button
                  disabled={loading}
                  className="w-full py-2 bg-[#002E3E] text-white rounded-lg hover:bg-[#003B4D]"
                >
                  {loading ? "Enviando..." : "Enviar invitación"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default InviteGuestButton;
