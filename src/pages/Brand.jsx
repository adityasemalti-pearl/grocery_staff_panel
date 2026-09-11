import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  X,
  Tag,
  Package,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../api/brandApis";
import { getProducts } from "../api/productApis";

const slugify = (value) =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeList = (response) => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

const EMPTY_FORM = {
  name: "",
  slug: "",
  isActive: true,
};

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [productCounts, setProductCounts] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [editingBrand, setEditingBrand] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [slugTouched, setSlugTouched] = useState(false);

  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 3000);
  };

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBrands();
      setBrands(normalizeList(response));
    } catch (err) {
      setError(err.message);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  /*
   * The /brands API doesn't return a product count, so we derive it from
   * the products list, same approach used on the Categories page. Best
   * effort — if this fails, brands still load fine and just show 0.
   */
  const loadProductCounts = async () => {
    try {
      const response = await getProducts({ limit: 1000 });
      const products = normalizeList(response);

      const counts = {};

      products.forEach((product) => {
        const brandId = product.brandId || product.brand?.id;

        if (!brandId) return;

        counts[brandId] = (counts[brandId] || 0) + 1;
      });

      setProductCounts(counts);
    } catch {
      setProductCounts({});
    }
  };

  useEffect(() => {
    loadBrands();
    loadProductCounts();
  }, []);

  const filteredBrands = useMemo(() => {
    return brands.filter((brand) => {
      const name = brand.name || "";
      const slug = brand.slug || "";

      const matchesSearch =
        name.toLowerCase().includes(search.toLowerCase()) ||
        slug.toLowerCase().includes(search.toLowerCase());

      const isActive = brand.isActive !== false;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && isActive) ||
        (statusFilter === "inactive" && !isActive);

      return matchesSearch && matchesStatus;
    });
  }, [brands, search, statusFilter]);

  const totalBrands = brands.length;

  const activeBrands = brands.filter(
    (item) => item.isActive !== false
  ).length;

  const inactiveBrands = brands.filter(
    (item) => item.isActive === false
  ).length;

  const totalProducts = Object.values(productCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const openAddModal = () => {
    setEditingBrand(null);
    setForm(EMPTY_FORM);
    setSlugTouched(false);
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (brand) => {
    setEditingBrand(brand);

    setForm({
      name: brand.name || "",
      slug: brand.slug || "",
      isActive: brand.isActive !== false,
    });

    // Existing brands already have a slug — don't auto-overwrite it.
    setSlugTouched(true);
    setFormError("");
    setModalOpen(true);
  };

  const openViewModal = (brand) => {
    setSelectedBrand(brand);
    setViewModalOpen(true);
  };

  const openDeleteModal = (brand) => {
    setSelectedBrand(brand);
    setDeleteError("");
    setDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === "slug") {
      setSlugTouched(true);
    }

    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      if (name === "name" && !slugTouched) {
        next.slug = slugify(value);
      }

      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!form.name.trim()) {
      setFormError("Brand name is required.");
      return;
    }

    if (!form.slug.trim()) {
      setFormError("Slug is required.");
      return;
    }

    try {
      setSaving(true);

      if (editingBrand) {
        await updateBrand(editingBrand.id, {
          name: form.name.trim(),
          slug: form.slug.trim(),
          isActive: form.isActive,
        });

        showToast("Brand updated successfully");
      } else {
        const payload = {
          name: form.name.trim(),
          slug: form.slug.trim(),
        };

        // Only sent when it deviates from the backend's default (active).
        if (!form.isActive) {
          payload.isActive = false;
        }

        await createBrand(payload);

        showToast("Brand created successfully");
      }

      setModalOpen(false);
      await loadBrands();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBrand) return;

    setDeleteError("");

    try {
      setDeleting(true);

      await deleteBrand(selectedBrand.id);

      setDeleteModalOpen(false);
      setSelectedBrand(null);
      showToast("Brand deleted successfully");

      await loadBrands();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const toggleStatus = async (brand) => {
    const nextIsActive = !(brand.isActive !== false);

    // Optimistic update so the toggle feels instant.
    setBrands((prev) =>
      prev.map((item) =>
        item.id === brand.id
          ? { ...item, isActive: nextIsActive }
          : item
      )
    );

    try {
      await updateBrand(brand.id, { isActive: nextIsActive });
    } catch (err) {
      // Revert on failure.
      setBrands((prev) =>
        prev.map((item) =>
          item.id === brand.id
            ? { ...item, isActive: brand.isActive }
            : item
        )
      );

      showToast(err.message);
    }
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Brands
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Manage the brands your products are sold under.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <StatCard
          title="Total Brands"
          value={totalBrands}
          icon={<Tag className="w-5 h-5" />}
        />

        <StatCard
          title="Active"
          value={activeBrands}
          icon={<CheckCircle2 className="w-5 h-5" />}
        />

        <StatCard
          title="Inactive"
          value={inactiveBrands}
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
              placeholder="Search brands..."
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

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-14 text-center text-sm text-gray-400">
          Loading brands...
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70">

                    <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Brand
                    </th>

                    <th className="text-left px-5 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                      Slug
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
                  {filteredBrands.map((brand) => {
                    const isActive = brand.isActive !== false;
                    const productCount = productCounts[brand.id] || 0;

                    return (
                      <tr
                        key={brand.id}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition"
                      >

                        {/* Brand */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-xl bg-green-50 overflow-hidden flex items-center justify-center shrink-0">
                              <Tag className="w-5 h-5 text-green-600" />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {brand.name}
                              </p>
                            </div>

                          </div>
                        </td>

                        {/* Slug */}
                        <td className="px-5 py-4">
                          <p className="text-sm text-gray-500">
                            {brand.slug}
                          </p>
                        </td>

                        {/* Products */}
                        <td className="px-5 py-4 text-center">
                          <span className="inline-flex items-center justify-center min-w-10 px-2.5 py-1 rounded-lg bg-green-50 text-green-700 text-xs font-bold">
                            {productCount}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 text-center">
                          <button
                            onClick={() => toggleStatus(brand)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                              isActive
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isActive ? "bg-green-500" : "bg-red-500"
                              }`}
                            />

                            {isActive ? "Active" : "Inactive"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end items-center gap-1">

                            <button
                              onClick={() => openViewModal(brand)}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openEditModal(brand)}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => openDeleteModal(brand)}
                              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>
            </div>

            {filteredBrands.length === 0 && (
              <EmptyState />
            )}

          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">

            {filteredBrands.map((brand) => {
              const isActive = brand.isActive !== false;
              const productCount = productCounts[brand.id] || 0;

              return (
                <div
                  key={brand.id}
                  className="bg-white rounded-2xl border border-gray-100 p-4"
                >

                  <div className="flex items-start gap-3">

                    <div className="w-14 h-14 rounded-xl bg-green-50 shrink-0 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            {brand.name}
                          </h3>

                          <p className="text-xs text-gray-400 mt-1">
                            {brand.slug}
                          </p>
                        </div>

                        <button
                          onClick={() => toggleStatus(brand)}
                          className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold ${
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-600"
                          }`}
                        >
                          {isActive ? "active" : "inactive"}
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">

                        <span className="text-xs text-gray-500">
                          <span className="font-bold text-gray-900">
                            {productCount}
                          </span>{" "}
                          Products
                        </span>

                        <div className="flex items-center gap-1">

                          <button
                            onClick={() => openViewModal(brand)}
                            className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openEditModal(brand)}
                            className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => openDeleteModal(brand)}
                            className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

            {filteredBrands.length === 0 && <EmptyState />}

          </div>
        </>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">

            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

              <div>
                <h3 className="text-lg font-extrabold text-gray-900">
                  {editingBrand ? "Edit Brand" : "Add Brand"}
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  {editingBrand
                    ? "Update brand details."
                    : "Create a new brand."}
                </p>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                disabled={saving}
                className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="p-5 space-y-4">

                {formError && (
                  <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-xl text-sm font-medium">
                    {formError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Brand Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="Enter brand name"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-400"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Slug *
                  </label>

                  <input
                    type="text"
                    name="slug"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder="brand-slug"
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-400"
                  />

                  <p className="text-[11px] text-gray-400 mt-1">
                    Auto-filled from the name — edit it directly if you need
                    something different.
                  </p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Status
                  </label>

                  <select
                    name="isActive"
                    value={form.isActive ? "active" : "inactive"}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isActive: e.target.value === "active",
                      }))
                    }
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
                  disabled={saving}
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingBrand
                    ? "Update Brand"
                    : "Create Brand"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

            <div className="relative h-40 bg-green-50 flex items-center justify-center">

              <Tag className="w-10 h-10 text-green-400" />

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
                    {selectedBrand.name}
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    {selectedBrand.slug}
                  </p>
                </div>

                <span
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold ${
                    selectedBrand.isActive !== false
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {selectedBrand.isActive !== false
                    ? "active"
                    : "inactive"}
                </span>

              </div>

              <div className="mt-5 p-4 rounded-xl bg-gray-50 flex items-center justify-between">

                <span className="text-sm text-gray-500">
                  Total Products
                </span>

                <span className="text-lg font-extrabold text-gray-900">
                  {productCounts[selectedBrand.id] || 0}
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
      {deleteModalOpen && selectedBrand && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">

            <div className="w-12 h-12 mx-auto rounded-xl bg-red-50 flex items-center justify-center text-red-500">
              <Trash2 className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-extrabold text-gray-900 mt-4">
              Delete Brand?
            </h3>

            <p className="text-sm text-gray-400 mt-2">
              Are you sure you want to delete{" "}
              <span className="font-bold text-gray-700">
                {selectedBrand.name}
              </span>
              ?
            </p>

            {deleteError && (
              <div className="bg-red-50 text-red-600 px-3 py-2.5 rounded-xl text-sm font-medium mt-4 text-left">
                {deleteError}
              </div>
            )}

            <div className="flex gap-2 mt-6">

              <button
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-11 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>

            </div>

          </div>

        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-3 rounded-xl text-sm z-[110] shadow-lg">
          {toast}
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
        <Tag className="w-5 h-5 text-gray-400" />
      </div>

      <p className="text-sm font-bold text-gray-700 mt-3">
        No brands found
      </p>

      <p className="text-xs text-gray-400 mt-1">
        Try changing your search or filter.
      </p>

    </div>
  );
}