import { useState } from "react";
import { RefreshCw } from "lucide-react";
import OrderDetailsModal from "../components/orders/OrderDetailsModal";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";
import { ShoppingBag } from "lucide-react";

const ordersData = [
  {
    id: 1,
    number: "CD-10021",
    customer: "Rahul Sharma",
    items: 3,
    amount: 1299,
    status: "PENDING_PAYMENT",
    date: "01 Sep 2026, 10:30 AM",
    phone: "+91 9876543210",
    address: "Rajpur Road, Dehradun, Uttarakhand",
    payment: "Online",
  },
  {
    id: 2,
    number: "CD-10020",
    customer: "Ankit Rawat",
    items: 2,
    amount: 849,
    status: "CONFIRMED",
    date: "01 Sep 2026, 09:45 AM",
    phone: "+91 9876543211",
    address: "Clock Tower, Dehradun, Uttarakhand",
    payment: "Online",
  },
  {
    id: 3,
    number: "CD-10019",
    customer: "Neha Singh",
    items: 4,
    amount: 2199,
    status: "PACKED",
    date: "31 Aug 2026, 06:20 PM",
    phone: "+91 9876543212",
    address: "Jakhan, Dehradun, Uttarakhand",
    payment: "COD",
  },
  {
    id: 4,
    number: "CD-10018",
    customer: "Amit Kumar",
    items: 1,
    amount: 499,
    status: "READY",
    date: "31 Aug 2026, 04:10 PM",
    phone: "+91 9876543213",
    address: "Vasant Vihar, Dehradun",
    payment: "Online",
  },
  {
    id: 5,
    number: "CD-10017",
    customer: "Priya Joshi",
    items: 5,
    amount: 2899,
    status: "COMPLETED",
    date: "30 Aug 2026, 02:15 PM",
    phone: "+91 9876543214",
    address: "Clement Town, Dehradun",
    payment: "Online",
  },
  {
    id: 6,
    number: "CD-10016",
    customer: "Vikas Negi",
    items: 2,
    amount: 799,
    status: "CANCELLED",
    date: "30 Aug 2026, 11:30 AM",
    phone: "+91 9876543215",
    address: "Prem Nagar, Dehradun",
    payment: "COD",
  },
];

const STATUSES = [
  ["", "All"],
  ["PENDING_PAYMENT", "Pending payment"],
  ["CONFIRMED", "Confirmed"],
  ["PACKED", "Packed"],
  ["READY", "Ready"],
  ["COMPLETED", "Completed"],
  ["CANCELLED", "Cancelled"],
];

const STATUS_TONE = {
  PENDING_PAYMENT: "amber",
  CONFIRMED: "sky",
  PACKED: "violet",
  READY: "teal",
  COMPLETED: "brand",
  CANCELLED: "rose",
};

export default function Orders() {
  const showToast = useToast();
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = filter ? ordersData.filter((o) => o.status === filter) : ordersData;

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Orders</h2>
          <p className="text-sm text-ink-soft mt-1">Track and fulfill customer orders.</p>
        </div>

        <Button variant="secondary" icon={RefreshCw} onClick={() => showToast("Orders refreshed")}>
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {STATUSES.map(([value, label]) => (
          <Button
            key={value}
            size="sm"
            variant={filter === value ? "primary" : "secondary"}
            onClick={() => setFilter(value)}
            className="rounded-full"
          >
            {label}
          </Button>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card>
          <EmptyState icon={ShoppingBag} title="No orders here yet" description="Orders matching this filter will show up here." />
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {orders.map((order) => (
            <Card
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="p-4 flex justify-between items-center gap-3 flex-wrap cursor-pointer hover:border-brand-500 transition-colors"
            >
              <div className="min-w-0">
                <div className="font-extrabold text-[17px] text-ink">{order.number}</div>
                <div className="text-ink-soft text-[13px] mt-0.5">
                  {order.customer} · {order.items} items · {order.date}
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="font-extrabold text-base text-ink">₹{order.amount.toLocaleString()}</div>
                <Badge tone={STATUS_TONE[order.status]}>{order.status.replace("_", " ")}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAction={(message) => {
            setSelectedOrder(null);
            showToast(message);
          }}
        />
      )}
    </div>
  );
}