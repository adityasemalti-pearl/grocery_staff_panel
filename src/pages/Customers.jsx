import { useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShoppingBag,
  Eye,
  MoreVertical,
  X,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
} from "lucide-react";

const CUSTOMERS = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@gmail.com",
    phone: "+91 98765 43210",
    orders: 24,
    spent: 8420,
    status: "Active",
    joined: "12 Aug 2026",
    address: "Rajpur Road, Dehradun",
  },
  {
    id: 2,
    name: "Priya Verma",
    email: "priya.verma@gmail.com",
    phone: "+91 98765 12345",
    orders: 18,
    spent: 6240,
    status: "Active",
    joined: "08 Aug 2026",
    address: "Ballupur, Dehradun",
  },
  {
    id: 3,
    name: "Amit Kumar",
    email: "amit.kumar@gmail.com",
    phone: "+91 91234 56789",
    orders: 9,
    spent: 3180,
    status: "Inactive",
    joined: "02 Aug 2026",
    address: "Sahastradhara Road, Dehradun",
  },
  {
    id: 4,
    name: "Neha Singh",
    email: "neha.singh@gmail.com",
    phone: "+91 99887 66554",
    orders: 31,
    spent: 12560,
    status: "Active",
    joined: "28 Jul 2026",
    address: "Clement Town, Dehradun",
  },
  {
    id: 5,
    name: "Vikas Rawat",
    email: "vikas.rawat@gmail.com",
    phone: "+91 97654 32109",
    orders: 7,
    spent: 2450,
    status: "Active",
    joined: "21 Jul 2026",
    address: "Patel Nagar, Dehradun",
  },
  {
    id: 6,
    name: "Anjali Gupta",
    email: "anjali.gupta@gmail.com",
    phone: "+91 98989 11223",
    orders: 14,
    spent: 5190,
    status: "Inactive",
    joined: "15 Jul 2026",
    address: "Vasant Vihar, Dehradun",
  },
  {
    id: 7,
    name: "Rohit Negi",
    email: "rohit.negi@gmail.com",
    phone: "+91 90123 45678",
    orders: 22,
    spent: 7860,
    status: "Active",
    joined: "10 Jul 2026",
    address: "Prem Nagar, Dehradun",
  },
];

export default function Customers() {
  const [search, setSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const filteredCustomers = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return CUSTOMERS;

    return CUSTOMERS.filter(
      (customer) =>
        customer.name.toLowerCase().includes(value) ||
        customer.email.toLowerCase().includes(value) ||
        customer.phone.includes(value),
    );
  }, [search]);

  const totalCustomers = CUSTOMERS.length;
  const activeCustomers = CUSTOMERS.filter(
    (c) => c.status === "Active",
  ).length;
  const inactiveCustomers = CUSTOMERS.filter(
    (c) => c.status === "Inactive",
  ).length;

  const totalOrders = CUSTOMERS.reduce(
    (sum, customer) => sum + customer.orders,
    0,
  );

  return (
    <Layout title="Customers">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
              Customers
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Manage and monitor all your store customers.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-600">
            <Users className="w-4 h-4 text-green-700" />
            {totalCustomers} Total Customers
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            icon={Users}
            iconBg="bg-green-50"
            iconColor="text-green-700"
          />

          <StatCard
            title="Active Customers"
            value={activeCustomers}
            icon={UserCheck}
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <StatCard
            title="Inactive Customers"
            value={inactiveCustomers}
            icon={UserX}
            iconBg="bg-red-50"
            iconColor="text-red-500"
          />

          <StatCard
            title="Total Orders"
            value={totalOrders}
            icon={ShoppingBag}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-gray-900">
                All Customers
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                View customer details, orders and activity.
              </p>
            </div>

            <div className="w-full md:w-[300px] h-10 flex items-center px-3 rounded-xl bg-gray-50 border border-gray-100 focus-within:bg-white focus-within:border-green-200 transition">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer..."
                className="w-full ml-2 bg-transparent outline-none text-xs text-gray-700 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Contact
                  </th>
                  <th className="text-center px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Orders
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Total Spent
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Joined
                  </th>
                  <th className="text-right px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <CustomerRow
                    key={customer.id}
                    customer={customer}
                    onView={() => setSelectedCustomer(customer)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredCustomers.map((customer) => (
              <div key={customer.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={customer.name} />

                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {customer.name}
                      </p>

                      <p className="text-[11px] text-gray-400 truncate">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={customer.status} />
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <InfoMini label="Orders" value={customer.orders} />
                  <InfoMini
                    label="Spent"
                    value={`₹${customer.spent.toLocaleString("en-IN")}`}
                  />
                  <InfoMini label="Joined" value={customer.joined} />
                </div>

                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="mt-4 w-full h-9 rounded-lg border border-gray-200 text-xs font-bold text-gray-600 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition flex items-center justify-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Customer
                </button>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredCustomers.length === 0 && (
            <div className="py-16 text-center">
              <Users className="w-10 h-10 mx-auto text-gray-200" />
              <p className="text-sm font-bold text-gray-500 mt-3">
                No customers found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with another name, email or phone number.
              </p>
            </div>
          )}

          {/* Footer */}
          {filteredCustomers.length > 0 && (
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
              <p className="text-[11px] text-gray-400">
                Showing{" "}
                <span className="font-bold text-gray-600">
                  {filteredCustomers.length}
                </span>{" "}
                customers
              </p>

              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg border border-gray-200 text-xs text-gray-400">
                  ‹
                </button>

                <button className="w-8 h-8 rounded-lg bg-green-700 text-white text-xs font-bold">
                  1
                </button>

                <button className="w-8 h-8 rounded-lg border border-gray-200 text-xs text-gray-400">
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </Layout>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] sm:text-xs font-semibold text-gray-400">
            {title}
          </p>

          <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
            {value}
          </p>
        </div>

        <div
          className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function CustomerRow({ customer, onView }) {
  return (
    <tr className="border-b border-gray-50 hover:bg-green-50/30 transition">
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={customer.name} />

          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900">
              {customer.name}
            </p>

            <p className="text-[10px] text-gray-400 mt-0.5">
              Customer #{customer.id.toString().padStart(4, "0")}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-4">
        <p className="text-xs text-gray-700">{customer.email}</p>
        <p className="text-[10px] text-gray-400 mt-1">{customer.phone}</p>
      </td>

      <td className="px-5 py-4 text-center">
        <span className="text-xs font-bold text-gray-800">
          {customer.orders}
        </span>
      </td>

      <td className="px-5 py-4">
        <span className="text-xs font-bold text-gray-900">
          ₹{customer.spent.toLocaleString("en-IN")}
        </span>
      </td>

      <td className="px-5 py-4">
        <StatusBadge status={customer.status} />
      </td>

      <td className="px-5 py-4">
        <span className="text-[11px] text-gray-500">{customer.joined}</span>
      </td>

      <td className="px-5 py-4">
        <div className="flex justify-end">
          <button
            onClick={onView}
            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:text-green-700 hover:bg-green-50 hover:border-green-200 transition"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center text-xs font-extrabold shrink-0">
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
        active
          ? "bg-green-50 text-green-700"
          : "bg-red-50 text-red-500"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          active ? "bg-green-500" : "bg-red-400"
        }`}
      />
      {status}
    </span>
  );
}

function InfoMini({ label, value }) {
  return (
    <div>
      <p className="text-[9px] uppercase font-bold tracking-wide text-gray-400">
        {label}
      </p>
      <p className="text-xs font-bold text-gray-800 mt-1 truncate">
        {value}
      </p>
    </div>
  );
}

function CustomerModal({ customer, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-gray-900">
              Customer Details
            </h3>

            <p className="text-[10px] text-gray-400 mt-0.5">
              Customer #{customer.id.toString().padStart(4, "0")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile */}
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-700 flex items-center justify-center text-sm font-black">
              {customer.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <h4 className="text-base font-extrabold text-gray-900">
                {customer.name}
              </h4>

              <div className="mt-1">
                <StatusBadge status={customer.status} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <DetailBox
              icon={Mail}
              label="Email"
              value={customer.email}
            />

            <DetailBox
              icon={Phone}
              label="Phone"
              value={customer.phone}
            />

            <DetailBox
              icon={CalendarDays}
              label="Joined"
              value={customer.joined}
            />

            <DetailBox
              icon={MapPin}
              label="Address"
              value={customer.address}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-[10px] text-gray-400 font-semibold">
                Total Orders
              </p>
              <p className="text-xl font-black text-gray-900 mt-1">
                {customer.orders}
              </p>
            </div>

            <div className="rounded-xl bg-green-50 p-4">
              <p className="text-[10px] text-green-700 font-semibold">
                Total Spent
              </p>
              <p className="text-xl font-black text-green-800 mt-1">
                ₹{customer.spent.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* Action */}
          <button
            onClick={onClose}
            className="w-full mt-5 h-11 rounded-xl bg-green-700 text-white text-xs font-bold hover:bg-green-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-gray-100 p-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-green-50 text-green-700 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] uppercase font-bold tracking-wide text-gray-400">
          {label}
        </p>

        <p className="text-xs font-semibold text-gray-800 mt-1 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}