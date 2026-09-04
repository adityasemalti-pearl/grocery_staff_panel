import { useState } from "react";

export default function ReceiveStockModal({
  productName,
  variant,
  onClose,
  onSave,
}) {
  const [quantity, setQuantity] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const submit = async (e) => {
    e.preventDefault();

    setError("");

    if (!quantity || Number(quantity) <= 0) {
      setError(
        "Please enter a valid quantity."
      );
      return;
    }

    if (!reason.trim()) {
      setError(
        "Please enter a reason or note."
      );
      return;
    }

    try {
      setLoading(true);

      await onSave({
        quantity: Number(quantity),
        reason: reason.trim(),
        performedBy:
          localStorage.getItem(
            "staffName"
          ) || "Staff",
      });

      onClose();
    } catch (err) {
      setError(
        err.message ||
          "Failed to add stock"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,38,32,0.45)] flex items-start justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] max-w-[420px] w-full p-6 mt-5"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        <button
          type="button"
          onClick={onClose}
          className="float-right text-2xl text-[#5b6960]"
        >
          ×
        </button>

        <h2 className="font-['Baloo_2'] text-xl font-bold">
          Receive Stock
        </h2>

        <p className="text-[#5b6960] text-[13px] mb-5">
          {productName} · {variant.sku}
        </p>

        {error && (
          <div className="bg-[#fbe9e7] text-[#b3382c] px-3 py-2.5 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <label className="label">
            Quantity received
          </label>

          <input
            type="number"
            min="1"
            step="1"
            required
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value)
            }
            className="input"
          />

          <label className="label">
            Reason / note
          </label>

          <input
            type="text"
            required
            placeholder="e.g. Weekly restock from distributor"
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
            className="input"
          />

          <div className="flex gap-2.5 mt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-3 border border-[#dde3dc] rounded-lg font-semibold"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-[#1b7340] hover:bg-[#124d2a] text-white rounded-lg font-semibold disabled:opacity-60"
            >
              {loading
                ? "Adding..."
                : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}