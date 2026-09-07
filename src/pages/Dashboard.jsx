import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Eye,
  MoreHorizontal,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle2,
  Truck,
  XCircle,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "₹2,84,650",
    change: "+12.8%",
    positive: true,
    icon: CircleDollarSign,
    description: "vs last month",
  },
  {
    title: "Total Orders",
    value: "1,284",
    change: "+8.4%",
    positive: true,
    icon: ShoppingBag,
    description: "vs last month",
  },
  {
    title: "Active Orders",
    value: "86",
    change: "+5.2%",
    positive: true,
    icon: Truck,
    description: "currently processing",
  },
  {
    title: "Out of Stock",
    value: "24",
    change: "-6.1%",
    positive: true,
    icon: Package,
    description: "items need attention",
  },
];

const orders = [
  {
    id: "#CD-10482",
    customer: "Rahul Sharma",
    items: "5 Items",
    amount: "₹1,240",
    status: "Completed",
    time: "10 min ago",
  },
  {
    id: "#CD-10481",
    customer: "Priya Mehta",
    items: "3 Items",
    amount: "₹685",
    status: "Ready",
    time: "24 min ago",
  },
  {
    id: "#CD-10480",
    customer: "Amit Kapoor",
    items: "8 Items",
    amount: "₹2,150",
    status: "Packed",
    time: "42 min ago",
  },
  {
    id: "#CD-10479",
    customer: "Sneha Joshi",
    items: "4 Items",
    amount: "₹920",
    status: "Pending",
    time: "1 hr ago",
  },
  {
    id: "#CD-10478",
    customer: "Vikas Rawat",
    items: "6 Items",
    amount: "₹1,560",
    status: "Completed",
    time: "1 hr ago",
  },
];

const products = [
  {
    name: "Tata Salt",
    category: "Staples",
    sold: 284,
    revenue: "₹8,520",
    image:
      "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=100&q=80",
  },
  {
    name: "Aashirvaad Atta",
    category: "Flour & Grains",
    sold: 218,
    revenue: "₹12,430",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=100&q=80",
  },
  {
    name: "Amul Milk",
    category: "Dairy",
    sold: 196,
    revenue: "₹10,780",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=100&q=80",
  },
  {
    name: "Fortune Sunflower Oil",
    category: "Cooking Oil",
    sold: 164,
    revenue: "₹14,760",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80",
  },
];

const lowStock = [
  {
    name: "Amul Butter",
    stock: 4,
    unit: "packs",
  },
  {
    name: "Maggi 2-Minute Noodles",
    stock: 7,
    unit: "packs",
  },
  {
    name: "Tata Tea Gold",
    stock: 9,
    unit: "packs",
  },
  {
    name: "Kissan Tomato Ketchup",
    stock: 12,
    unit: "bottles",
  },
];

const salesData = [
  42, 55, 48, 68, 62, 74, 69, 81, 76, 88, 79, 94, 87, 102, 96, 110, 105, 118,
  112, 126, 119, 132, 125, 140, 134, 148, 143, 156, 150, 168,
];

const statusConfig = {
  Completed: {
    icon: CheckCircle2,
    className: "bg-green-50 text-green-700 border-green-100",
  },
  Ready: {
    icon: Truck,
    className: "bg-blue-50 text-blue-700 border-blue-100",
  },
  Packed: {
    icon: Package,
    className: "bg-purple-50 text-purple-700 border-purple-100",
  },
  Pending: {
    icon: Clock3,
    className: "bg-amber-50 text-amber-700 border-amber-100",
  },
  Cancelled: {
    icon: XCircle,
    className: "bg-red-50 text-red-600 border-red-100",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
}

function MiniAvatar({ name }) {
  const initials = name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="w-9 h-9 rounded-xl bg-green-50 border border-green-100 text-green-700 flex items-center justify-center text-[11px] font-extrabold shrink-0">
      {initials}
    </div>
  );
}

export default function Dashboard() {
  const maxValue = Math.max(...salesData);

  return (
    <div className="space-y-6 pb-8">
      {/* Page Heading */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-green-700">
              Store Overview
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Good morning, Admin 👋
          </h2>

          <p className="text-sm text-gray-500 mt-1.5">
            Here's what's happening with your store today.
          </p>
        </div>

        <button className="self-start lg:self-auto inline-flex items-center gap-2 h-10 px-4 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:border-green-200 hover:text-green-700 transition shadow-sm">
          <CalendarDays className="w-4 h-4" />
          September 2026
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg hover:shadow-green-900/5 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-400">
                    {stat.title}
                  </p>

                  <h3 className="text-2xl font-extrabold text-gray-900 mt-2 tracking-tight">
                    {stat.value}
                  </h3>
                </div>

                <div className="w-11 h-11 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center group-hover:bg-green-700 transition-colors duration-300">
                  <Icon className="w-5 h-5 text-green-700 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md">
                  {stat.positive ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  {stat.change}
                </span>

                <span className="text-[10px] text-gray-400">
                  {stat.description}
                </span>
              </div>

              <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-green-50/60 group-hover:scale-150 transition-transform duration-500" />
            </div>
          );
        })}
      </div>

      {/* Main Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-50">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  Sales Overview
                </h3>

                <span className="px-2 py-1 rounded-md bg-green-50 text-[9px] font-bold text-green-700">
                  +18.4%
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-1">
                Revenue performance for the last 30 days
              </p>
            </div>

            <button className="self-start sm:self-auto inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-[10px] font-bold text-gray-500 hover:bg-green-50 hover:text-green-700 transition">
              Last 30 Days
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-5 sm:p-6">
            <div className="flex items-end gap-2 mb-6">
              <span className="text-3xl font-extrabold text-gray-900">
                ₹2,84,650
              </span>

              <span className="text-xs text-green-600 font-bold mb-1">
                <TrendingUp className="inline w-3.5 h-3.5 mr-1" />
                18.4%
              </span>
            </div>

            <div className="h-[250px] flex">
              {/* Y Axis */}
              <div className="w-10 flex flex-col justify-between pb-7 text-[9px] text-gray-300">
                <span>₹15k</span>
                <span>₹10k</span>
                <span>₹5k</span>
                <span>₹0</span>
              </div>

              {/* Chart */}
              <div className="relative flex-1">
                {/* Grid */}
                <div className="absolute inset-0 flex flex-col justify-between pb-7">
                  {[1, 2, 3, 4].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-gray-100"
                    />
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end gap-[3px] sm:gap-1.5 pb-7 px-1">
                  {salesData.map((value, index) => {
                    const height = (value / maxValue) * 190;

                    return (
                      <div
                        key={index}
                        className="group/bar relative flex-1 h-full flex items-end"
                      >
                        <div
                          style={{ height: `${height}px` }}
                          className={`
                            w-full rounded-t-[5px] transition-all duration-300
                            ${
                              index === salesData.length - 1
                                ? "bg-green-700"
                                : "bg-green-100 hover:bg-green-300"
                            }
                          `}
                        />

                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-md bg-gray-900 text-white text-[9px] font-bold opacity-0 group-hover/bar:opacity-100 transition whitespace-nowrap z-10">
                          ₹{value * 100}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* X Axis */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[9px] text-gray-300">
                  <span>Aug 08</span>
                  <span>Aug 15</span>
                  <span>Aug 22</span>
                  <span>Aug 29</span>
                  <span>Sep 06</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 sm:p-6 border-b border-gray-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Order Status
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Today's order distribution
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4 text-green-700" />
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 rounded-full border-[16px] border-green-100" />
              <div
                className="absolute inset-0 rounded-full border-[16px] border-green-700"
                style={{
                  clipPath: "polygon(0 0, 100% 0, 100% 68%, 0 68%)",
                }}
              />
              <div
                className="absolute inset-0 rounded-full border-[16px] border-emerald-300"
                style={{
                  clipPath: "polygon(0 68%, 100% 68%, 100% 84%, 0 84%)",
                }}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-gray-900">
                  86
                </span>
                <span className="text-[10px] font-semibold text-gray-400">
                  Active Orders
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-6">
              {[
                ["Completed", 48, "bg-green-700"],
                ["Processing", 22, "bg-emerald-300"],
                ["Pending", 10, "bg-amber-400"],
                ["Cancelled", 6, "bg-gray-200"],
              ].map(([label, value, color]) => (
                <div
                  key={label}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${color}`}
                    />
                    <span className="text-xs font-semibold text-gray-500">
                      {label}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-gray-900">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-50">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Recent Orders
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Latest customer orders
              </p>
            </div>

            <button className="text-xs font-bold text-green-700 hover:text-green-800">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="bg-gray-50/70">
                  <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Order
                  </th>
                  <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Customer
                  </th>
                  <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Status
                  </th>
                  <th className="text-right px-5 py-3 text-[9px] font-bold uppercase tracking-wider text-gray-400">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-gray-50 hover:bg-green-50/30 transition"
                  >
                    <td className="px-5 py-4">
                      <span className="text-xs font-extrabold text-gray-900">
                        {order.id}
                      </span>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {order.items}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <MiniAvatar name={order.customer} />
                        <span className="text-xs font-bold text-gray-700">
                          {order.customer}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-xs font-extrabold text-gray-900">
                        {order.amount}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={order.status} />
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {order.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-50">
            <div>
              <h3 className="text-base font-extrabold text-gray-900">
                Top Products
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Best selling products
              </p>
            </div>

            <button className="w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4">
            {products.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-green-50/50 transition"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold text-gray-800 truncate">
                    {product.name}
                  </p>

                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {product.category} · {product.sold} sold
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-gray-900">
                    {product.revenue}
                  </p>

                  <span className="text-[9px] text-green-600 font-bold">
                    #{index + 1}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 pb-5">
            <button className="w-full h-10 rounded-xl bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition">
              View All Products
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-gray-900">
                  Low Stock Alert
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Products that need restocking
                </p>
              </div>
            </div>

            <span className="px-2.5 py-1.5 rounded-lg bg-red-50 text-red-600 text-[10px] font-bold">
              4 Critical
            </span>
          </div>

          <div className="p-4">
            {lowStock.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-3 px-2 py-3"
              >
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                  <Package className="w-4 h-4 text-red-500" />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-800">
                    {item.name}
                  </p>

                  <div className="mt-1.5 w-full max-w-[180px] h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-400"
                      style={{
                        width: `${Math.min(item.stock * 5, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-extrabold text-red-500">
                    {item.stock}
                  </p>

                  <p className="text-[9px] text-gray-400">{item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Performance */}
        <div className="bg-gradient-to-br from-green-800 to-green-700 rounded-2xl shadow-lg shadow-green-900/10 p-6 text-white overflow-hidden relative">
          <div className="relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] font-bold text-green-200">
                  Store Performance
                </p>

                <h3 className="text-2xl font-extrabold mt-2">
                  Excellent work!
                </h3>

                <p className="text-xs text-green-100 mt-2 max-w-[320px] leading-relaxed">
                  Your store performance is above average this month. Keep up
                  the great work.
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-7">
              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-lg font-extrabold">94%</p>
                <p className="text-[9px] text-green-200 mt-1">
                  Order Success
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-lg font-extrabold">4.8</p>
                <p className="text-[9px] text-green-200 mt-1">
                  Customer Rating
                </p>
              </div>

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-lg font-extrabold">98%</p>
                <p className="text-[9px] text-green-200 mt-1">
                  Stock Accuracy
                </p>
              </div>
            </div>
          </div>

          {/* Decorative circles */}
          <div className="absolute -right-16 -bottom-20 w-56 h-56 rounded-full border border-white/10" />
          <div className="absolute right-8 -bottom-28 w-48 h-48 rounded-full border border-white/10" />
        </div>
      </div>
    </div>
  );
}