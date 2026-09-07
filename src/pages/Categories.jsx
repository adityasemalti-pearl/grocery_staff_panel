import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Image as ImageIcon,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const INITIAL_CATEGORIES = [
  {
    id: 1,
    name: "Fruits & Vegetables",
    description: "Fresh fruits and vegetables",
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400",
    productCount: 42,
    status: "active",
  },
  {
    id: 2,
    name: "Dairy & Eggs",
    description: "Milk, cheese, butter and eggs",
    image:
      "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=400",
    productCount: 28,
    status: "active",
  },
  {
    id: 3,
    name: "Bakery & Bread",
    description: "Fresh bread and bakery products",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
    productCount: 19,
    status: "active",
  },
  {
    id: 4,
    name: "Rice, Atta & Grains",
    description: "Rice, flour and grains",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    productCount: 35,
    status: "active",
  },
  {
    id: 5,
    name: "Snacks & Namkeen",
    description: "Chips, namkeen and snacks",
    image:
      "https://images.unsplash.com/photo-1621939514649-280e2aa6b6b4?w=400",
    productCount: 31,
    status: "inactive",
  },
  {
    id: 6,
    name: "Beverages",
    description: "Cold drinks, juices and beverages",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400",
    productCount: 24,
    status: "active",
  },
];

export default function Categories() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    status: "active",
  });

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch =
        category.name.toLowerCase().includes(search.toLowerCase()) ||
        category.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || category.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categories, search, statusFilter]);

  const totalCategories = categories.length;
  const activeCategories = categories.filter(
    (item) => item.status === "active"
  ).length;
  const inactiveCategories = categories.filter(
    (item) => item.status === "inactive"
  ).length;
  const totalProducts = categories.reduce(
    (sum, item) => sum + item.productCount,
    0
  );

  const openAddModal = () => {
    setEditingCategory(null);

    setForm({
      name: "",
      description: "",
      image: "",
      status: "active",
    });

    setModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);

    setForm({
      name: category.name,
      description: category.description,
      image: category.image,
      status: category.status,
    });

    setModalOpen(true);
  };

  const openViewModal = (category) => {
    setSelectedCategory(category);
    setViewModalOpen(true);
  };

  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Category name is required");
      return;
    }

    if (editingCategory) {
      // Later replace this with UPDATE API
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingCategory.id
            ? {
                ...category,
                name: form.name,
                description: form.description,
                image: form.image,
                status: form.status,
              }
            : category
        )
      );
    } else {
      // Later replace this with CREATE API
      const newCategory = {
        id: Date.now(),
        name: form.name,
        description: form.description,
        image:
          form.image ||
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
        productCount: 0,
        status: form.status,
      };

      setCategories((prev) => [newCategory, ...prev]);
    }

    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!selectedCategory) return;

    // Later replace this with DELETE API
    setCategories((prev) =>
      prev.filter((category) => category.id !== selectedCategory.id)
    );

    setDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  const toggleStatus = (category) => {
    // Later replace this with UPDATE STATUS API
    setCategories((prev) =>
      prev.map((item) =>
        item.id === category.id
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Categories
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Manage your store categories and organize products.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Categories"
          value={totalCategories}
          icon={<Package className="w-5 h-5" />}
        />

        <StatCard
          title="Active"
          value={activeCategories}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />

        <StatCard
          title="Inactive"
          value={inactiveCategories}
          icon={<XCircle className="w-5 h-5" />}
        />

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={<Package className="w-5 h-5" />}
        />

      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="flex-1 flex items-center h-11 px-3 rounded-xl bg-gray-50 border border-gray-100 focus-within:bg-white focus-within:border-green-200">
            <Search className="w-4 h-4 text-gray-400" />

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ml-2 bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 outline-none focus:border-green-400"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full">

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/70">

                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Category
                </th>

                <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Description
                </th>

                <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Products
                </th>

                <th className="text-center px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                >

                  {/* Category */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                        {category.image ? (
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {category.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-0.5">
                          ID: #{category.id}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* Description */}
                  <td className="px-5 py-4">
                    <p className="text-sm text-gray-500 max-w-[280px] truncate">
                      {category.description || "No description"}
                    </p>
                  </td>

                  {/* Products */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-10 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                      {category.productCount}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 text-center">
                    <button
                      onClick={() => toggleStatus(category)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                        category.status === "active"
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          category.status === "active"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      />

                      {category.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end items-center gap-1">

                      <button
                        onClick={() => openViewModal(category)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openEditModal(category)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => openDeleteModal(category)}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {filteredCategories.length === 0 && (
          <EmptyState />
        )}

      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">

        {filteredCategories.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-2xl border border-gray-100 p-4"
          >

            <div className="flex items-start gap-3">

              <div className="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      {category.name}
                    </h3>

                    <p className="text-xs text-gray-400 mt-1">
                      {category.description}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleStatus(category)}
                    className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold ${
                      category.status === "active"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {category.status}
                  </button>
                </div>

                <div className="flex items-center justify-between mt-4">

                  <span className="text-xs text-gray-500">
                    <span className="font-bold text-gray-900">
                      {category.productCount}
                    </span>{" "}
                    Products
                  </span>

                  <div className="flex items-center gap-1">

                    <button
                      onClick={() => openViewModal(category)}
                      className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openEditModal(category)}
                      className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openDeleteModal(category)}
                      className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>

                </div>

              </div>

            </div>

          </div>
        ))}

        {filteredCategories.length === 0 && <EmptyState />}

      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  {editingCategory ? "Edit Category" : "Add Category"}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  {editingCategory
                    ? "Update category details."
                    : "Create a new store category."}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="p-5 space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Category Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter category name"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-400"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    placeholder="Enter category description"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none focus:border-green-400"
                  />
                </div>

                {/* Image */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Image URL
                  </label>

                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleFormChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-400"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-green-400"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

              </div>

              <div className="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="relative h-48 bg-gray-100">

              <img
                src={selectedCategory.image}
                alt={selectedCategory.name}
                className="w-full h-full object-cover"
              />

              <button
                onClick={() => setViewModalOpen(false)}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <div className="p-5">

              <div className="flex items-start justify-between gap-3">

                <div>
                  <h3 className="text-xl font-extrabold text-gray-900">
                    {selectedCategory.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Category #{selectedCategory.id}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                    selectedCategory.status === "active"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {selectedCategory.status}
                </span>

              </div>

              <p className="text-sm text-gray-500 mt-5">
                {selectedCategory.description || "No description available."}
              </p>

              <div className="mt-5 p-4 rounded-xl bg-gray-50 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Total Products
                </span>

                <span className="text-lg font-extrabold text-gray-900">
                  {selectedCategory.productCount}
                </span>

              </div>

              <button
                onClick={() => setViewModalOpen(false)}
                className="w-full mt-5 h-11 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

      {/* Delete Modal */}
      {deleteModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mt-4">
              Delete Category?
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-700">
                {selectedCategory.name}
              </span>
              ?
            </p>

            <div className="flex gap-2 mt-6">

              <button
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-semibold text-gray-400">
            {title}
          </p>

          <p className="text-2xl font-extrabold text-gray-900 mt-1">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-14 text-center">

      <div className="w-12 h-12 mx-auto rounded-xl bg-gray-50 flex items-center justify-center">
        <Package className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm font-bold text-gray-700 mt-3">
        No categories found
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Try changing your search or filter.
      </p>

    </div>
  );
}