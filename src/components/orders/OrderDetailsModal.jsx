import Modal from "../ui/Modal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const STATUS_TONE = {
  PENDING_PAYMENT: "amber",
  CONFIRMED: "sky",
  PACKED: "violet",
  READY: "teal",
  COMPLETED: "brand",
  CANCELLED: "rose",
};

export default function OrderDetailsModal({ order, onClose, onAction }) {
  const items = [
    { name: "Organic Rice", qty: 2, price: 500 },
    { name: "Premium Atta", qty: 1, price: 299 },
    { name: "Cooking Oil", qty: 1, price: 500 },
  ];

  return (
    <Modal
      title={order.number}
      description={`${order.date} · ${order.payment}`}
      onClose={onClose}
      width="md"
      footer={
        <div className="flex gap-2.5 flex-wrap w-full">
          {order.status === "PENDING_PAYMENT" && (
            <Button className="flex-1 min-w-[140px]" onClick={() => onAction("Order confirmed")}>
              Confirm order
            </Button>
          )}
          {order.status === "CONFIRMED" && (
            <Button className="flex-1 min-w-[140px]" onClick={() => onAction("Order marked as packed")}>
              Mark packed
            </Button>
          )}
          {order.status === "PACKED" && (
            <Button className="flex-1 min-w-[140px]" onClick={() => onAction("Order marked ready")}>
              Mark ready
            </Button>
          )}
          {order.status === "READY" && (
            <Button className="flex-1 min-w-[140px]" onClick={() => onAction("Order completed")}>
              Complete order
            </Button>
          )}
          {!["COMPLETED", "CANCELLED"].includes(order.status) && (
            <Button
              variant="danger"
              className="flex-1 min-w-[140px]"
              onClick={() => onAction("Order cancelled")}
            >
              Cancel order
            </Button>
          )}
        </div>
      }
    >
      <section className="mb-5">
        <h3 className="text-xs uppercase tracking-wide text-ink-faint font-bold mb-2">Items</h3>

        {items.map((item, index) => (
          <div key={index} className="flex justify-between py-2 border-b border-line text-sm">
            <span>{item.name} <span className="text-ink-soft">× {item.qty}</span></span>
            <span>₹{item.price}</span>
          </div>
        ))}

        <div className="flex justify-between font-bold pt-2.5 text-base text-ink">
          <span>Total</span>
          <span>₹{order.amount.toLocaleString()}</span>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="text-xs uppercase tracking-wide text-ink-faint font-bold mb-2">Customer</h3>
        <div className="text-sm leading-7 text-ink">
          <div><strong>{order.customer}</strong></div>
          <div>{order.phone}</div>
          <div>{order.address}</div>
        </div>
      </section>

      <section>
        <h3 className="text-xs uppercase tracking-wide text-ink-faint font-bold mb-2">Fulfillment</h3>
        <div className="flex items-center gap-2 text-sm text-ink">
          Current status:
          <Badge tone={STATUS_TONE[order.status] || "neutral"}>
            {order.status.replace("_", " ")}
          </Badge>
        </div>
      </section>
    </Modal>
  );
}