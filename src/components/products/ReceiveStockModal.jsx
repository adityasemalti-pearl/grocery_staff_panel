import { useState } from "react";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { Field, Input } from "../ui/Field";

export default function ReceiveStockModal({ productName, variant, onClose, onSave }) {
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!quantity || Number(quantity) <= 0) return setError("Please enter a valid quantity.");
    if (!reason.trim()) return setError("Please enter a reason or note.");

    try {
      setLoading(true);

      await onSave({
        quantity: Number(quantity),
        reason: reason.trim(),
        performedBy: localStorage.getItem("staffName") || "Staff",
      });

      onClose();
    } catch (err) {
      setError(err?.message || "Failed to add stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Receive stock"
      description={`${productName} · ${variant.sku}`}
      onClose={onClose}
      width="sm"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" form="receive-stock-form" loading={loading}>
            {loading ? "Adding..." : "Add stock"}
          </Button>
        </>
      }
    >
      <form id="receive-stock-form" onSubmit={submit}>
        {error && (
          <div className="bg-rose-50 text-rose-500 px-3 py-2.5 rounded-lg text-sm mb-4">{error}</div>
        )}

        <Field label="Quantity received" required>
          <Input
            type="number"
            min="1"
            step="1"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </Field>

        <Field label="Reason / note" required>
          <Input
            required
            placeholder="e.g. Weekly restock from distributor"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </Field>
      </form>
    </Modal>
  );
}