import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ShoppingBag,
  Eye,
  Mail,
  Phone,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { Card, StatCard } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

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
      (c) =>
        c.name.toLowerCase().includes(value) ||
        c.email.toLowerCase().includes(value) ||
        c.phone.includes(value)
    );
  }, [search]);

  const totalCustomers = CUSTOMERS.length;
  const activeCustomers = CUSTOMERS.filter((c) => c.status === "Active").length;
  const inactiveCustomers = CUSTOMERS.filter((c) => c.status === "Inactive").length;
  const totalOrders = CUSTOMERS.reduce((sum, c) => sum + c.orders, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Customers</h2>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Manage and monitor all your store customers.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2.5 bg-card border border-line rounded-lg text-xs font-semibold text-ink-soft">
          <Users className="w-4 h-4 text-brand-700" />
          {totalCustomers} total customers
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total customers" value={totalCustomers} icon={Users} tone="brand" />
        <StatCard label="Active customers" value={activeCustomers} icon={UserCheck} tone="brand" />
        <StatCard label="Inactive customers" value={inactiveCustomers} icon={UserX} tone="rose" />
        <StatCard label="Total orders" value={totalOrders} icon={ShoppingBag} tone="sky" />
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-line flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-ink">All customers</h3>
            <p className="text-[11px] text-ink-faint mt-0.5">View customer details, orders and activity.</p>
          </div>

          <div className="w-full md:w-[300px] h-10 flex items-center px-3 rounded-lg bg-paper border border-line focus-within:bg-white focus-within:border-brand-500 transition">
            <Search className="w-4 h-4 text-ink-faint shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer..."
              className="w-full ml-2 bg-transparent outline-none text-xs text-ink placeholder:text-ink-faint"
            />
          </div>
        </div>

        {filteredCustomers.length === 0 ? (
          <EmptyState icon={Users} title="No customers found" description="Try searching with another name, email or phone number." />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-paper/70 border-b border-line">
                    {["Customer", "Contact", "Orders", "Total spent", "Status", "Joined", "Action"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-ink-faint ${
                          i === 2 ? "text-center" : i === 6 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-line/70 hover:bg-paper/50 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={customer.name} />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-ink">{customer.name}</p>
                            <p className="text-[10px] text-ink-faint mt-0.5">
                              Customer #{String(customer.id).padStart(4, "0")}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs text-ink">{customer.email}</p>
                        <p className="text-[10px] text-ink-faint mt-1">{customer.phone}</p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="text-xs font-bold text-ink">{customer.orders}</span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-xs font-bold text-ink">₹{customer.spent.toLocaleString("en-IN")}</span>
                      </td>

                      <td className="px-5 py-4">
                        <Badge tone={customer.status === "Active" ? "brand" : "rose"} dot>{customer.status}</Badge>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-[11px] text-ink-soft">{customer.joined}</span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedCustomer(customer)}
                            className="w-8 h-8 rounded-lg border border-line flex items-center justify-center text-ink-soft hover:text-brand-700 hover:bg-brand-50 hover:border-brand-500 transition"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-line">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={customer.name} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-ink truncate">{customer.name}</p>
                        <p className="text-[11px] text-ink-faint truncate">{customer.email}</p>
                      </div>
                    </div>

                    <Badge tone={customer.status === "Active" ? "brand" : "rose"} dot>{customer.status}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <InfoMini label="Orders" value={customer.orders} />
                    <InfoMini label="Spent" value={`₹${customer.spent.toLocaleString("en-IN")}`} />
                    <InfoMini label="Joined" value={customer.joined} />
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Eye}
                    className="mt-4 w-full"
                    onClick={() => setSelectedCustomer(customer)}
                  >
                    View customer
                  </Button>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 border-t border-line flex items-center justify-between">
              <p className="text-[11px] text-ink-faint">
                Showing <span className="font-bold text-ink-soft">{filteredCustomers.length}</span> customers
              </p>
            </div>
          </>
        )}
      </Card>

      {selectedCustomer && (
        <Modal title="Customer details" description={`Customer #${String(selectedCustomer.id).padStart(4, "0")}`} onClose={() => setSelectedCustomer(null)} width="md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-sm font-black">
              {initialsOf(selectedCustomer.name)}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-ink">{selectedCustomer.name}</h4>
              <div className="mt-1">
                <Badge tone={selectedCustomer.status === "Active" ? "brand" : "rose"} dot>{selectedCustomer.status}</Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <DetailBox icon={Mail} label="Email" value={selectedCustomer.email} />
            <DetailBox icon={Phone} label="Phone" value={selectedCustomer.phone} />
            <DetailBox icon={CalendarDays} label="Joined" value={selectedCustomer.joined} />
            <DetailBox icon={MapPin} label="Address" value={selectedCustomer.address} />
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="rounded-lg bg-paper p-4">
              <p className="text-[10px] text-ink-faint font-semibold">Total orders</p>
              <p className="text-xl font-black text-ink mt-1">{selectedCustomer.orders}</p>
            </div>
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-[10px] text-brand-700 font-semibold">Total spent</p>
              <p className="text-xl font-black text-brand-800 mt-1">₹{selectedCustomer.spent.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

const initialsOf = (name) =>
  name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function Avatar({ name }) {
  return (
    <div className="w-10 h-10 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center text-xs font-extrabold shrink-0">
      {initialsOf(name)}
    </div>
  );
}

function InfoMini({ label, value }) {
  return (
    <div>
      <p className="text-[9px] uppercase font-bold tracking-wide text-ink-faint">{label}</p>
      <p className="text-xs font-bold text-ink mt-1 truncate">{value}</p>
    </div>
  );
}

function DetailBox({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-line p-3 flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[9px] uppercase font-bold tracking-wide text-ink-faint">{label}</p>
        <p className="text-xs font-semibold text-ink mt-1 break-words">{value}</p>
      </div>
    </div>
  );
}