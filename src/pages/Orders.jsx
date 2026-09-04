import { useState } from "react";
import Layout from "../components/Layout";
import OrderDetailsModal from "../components/OrderDetailsModal";

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

const statuses = [
  ["", "All"],
  ["PENDING_PAYMENT", "Pending Payment"],
  ["CONFIRMED", "Confirmed"],
  ["PACKED", "Packed"],
  ["READY", "Ready"],
  ["COMPLETED", "Completed"],
  ["CANCELLED", "Cancelled"],
];

const statusStyle = {
  PENDING_PAYMENT: "bg-[#fdf0d5] text-[#8a5a00]",
  CONFIRMED: "bg-[#e1ecfb] text-[#1c4c8c]",
  PACKED: "bg-[#ede3fb] text-[#5b2a9c]",
  READY: "bg-[#dcf3ee] text-[#0f6b58]",
  COMPLETED: "bg-[#e4f3e0] text-[#2f7a4f]",
  CANCELLED: "bg-[#f5e4e2] text-[#a33a2a]",
};

export default function Orders() {
  const [filter, setFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [toast, setToast] = useState("");

  const orders = filter
    ? ordersData.filter((order) => order.status === filter)
    : ordersData;

  const refresh = () => {
    setToast("Orders refreshed");
    setTimeout(() => setToast(""), 2000);
  };

  return (
    <Layout staffName={localStorage.getItem("staffName") || "Staff"}>
      <main className="max-w-[1180px] mx-auto px-5 py-5">

        <div className="flex justify-between items-center flex-wrap gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            {statuses.map(([value, label]) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  filter === value
                    ? "bg-[#1b1f1c] text-white border-[#1b1f1c]"
                    : "bg-white text-[#5b6960] border-[#dde3dc] hover:border-[#1b7340]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={refresh}
            className="bg-white border border-[#dde3dc] rounded-lg px-4 py-2 text-sm hover:border-[#1b7340]"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-col gap-2.5">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="bg-white border border-[#dde3dc] rounded-xl p-4 flex justify-between items-center gap-3 flex-wrap cursor-pointer hover:border-[#1b7340] hover:shadow-[0_2px_10px_rgba(27,115,64,0.08)] transition"
            >
              <div className="min-w-0">
                <div className="font-['Baloo_2'] font-bold text-[17px]">
                  {order.number}
                </div>

                <div className="text-[#5b6960] text-[13px] mt-0.5">
                  {order.customer} · {order.items} items · {order.date}
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="font-['Baloo_2'] font-bold text-base">
                  ₹{order.amount.toLocaleString()}
                </div>

                <span
                  className={`inline-block px-3.5 py-1.5 rounded-full text-[13px] font-bold whitespace-nowrap ${statusStyle[order.status]}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>

        {orders.length === 0 && (
          <div className="text-center text-[#5b6960] py-16">
            No orders here yet.
          </div>
        )}
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onAction={(message) => {
            setSelectedOrder(null);
            setToast(message);
            setTimeout(() => setToast(""), 2000);
          }}
        />
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-[#1b1f1c] text-white px-5 py-3 rounded-lg text-sm z-50">
          {toast}
        </div>
      )}
    </Layout>
  );
}