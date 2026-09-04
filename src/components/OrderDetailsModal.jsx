export default function OrderDetailsModal({
  order,
  onClose,
  onAction,
}) {
  const items = [
    { name: "Organic Rice", qty: 2, price: 500 },
    { name: "Premium Atta", qty: 1, price: 299 },
    { name: "Cooking Oil", qty: 1, price: 500 },
  ];

  return (
    <div
      className="fixed inset-0 bg-[rgba(28,38,32,0.45)] flex items-start justify-center px-4 py-6 overflow-y-auto z-40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[14px] max-w-[560px] w-full p-6 mt-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="float-right text-[24px] text-[#5b6960]"
        >
          ×
        </button>

        <h2 className="font-['Baloo_2'] text-xl font-bold mb-1">
          {order.number}
        </h2>

        <p className="text-[#5b6960] text-[13px] mb-[18px]">
          {order.date} · {order.payment}
        </p>

        <section className="mb-[18px]">
          <h3 className="text-xs uppercase tracking-wider text-[#5b6960] mb-2">
            Items
          </h3>

          {items.map((item, index) => (
            <div
              key={index}
              className="flex justify-between py-2 border-b border-[#dde3dc] text-sm"
            >
              <span>
                {item.name}{" "}
                <span className="text-[#5b6960]">× {item.qty}</span>
              </span>
              <span>₹{item.price}</span>
            </div>
          ))}

          <div className="flex justify-between font-bold pt-2.5 text-base">
            <span>Total</span>
            <span>₹{order.amount.toLocaleString()}</span>
          </div>
        </section>

        <section className="mb-[18px]">
          <h3 className="text-xs uppercase tracking-wider text-[#5b6960] mb-2">
            Customer
          </h3>

          <div className="text-sm leading-7">
            <div>
              <strong>{order.customer}</strong>
            </div>
            <div>{order.phone}</div>
            <div>{order.address}</div>
          </div>
        </section>

        <section className="mb-[18px]">
          <h3 className="text-xs uppercase tracking-wider text-[#5b6960] mb-2">
            Fulfillment
          </h3>

          <div className="text-sm">
            Current status:{" "}
            <strong>{order.status.replace("_", " ")}</strong>
          </div>
        </section>

        <div className="flex gap-2.5 mt-5 flex-wrap">
          {order.status === "PENDING_PAYMENT" && (
            <button
              onClick={() => onAction("Order confirmed")}
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-[#1b7340] text-white font-semibold"
            >
              Confirm Order
            </button>
          )}

          {order.status === "CONFIRMED" && (
            <button
              onClick={() => onAction("Order marked as packed")}
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-[#1b7340] text-white font-semibold"
            >
              Mark Packed
            </button>
          )}

          {order.status === "PACKED" && (
            <button
              onClick={() => onAction("Order marked ready")}
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-[#1b7340] text-white font-semibold"
            >
              Mark Ready
            </button>
          )}

          {order.status === "READY" && (
            <button
              onClick={() => onAction("Order completed")}
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-[#1b7340] text-white font-semibold"
            >
              Complete Order
            </button>
          )}

          {!["COMPLETED", "CANCELLED"].includes(order.status) && (
            <button
              onClick={() => onAction("Order cancelled")}
              className="flex-1 min-w-[140px] py-3 rounded-lg bg-[#b3382c] text-white font-semibold"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}