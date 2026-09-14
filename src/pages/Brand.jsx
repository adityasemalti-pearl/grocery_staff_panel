import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
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
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { Card, StatCard } from "../components/ui/Card";
import { Field, Input, Select } from "../components/ui/Field";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/Toast";

const slugify = (value) =>
  value.toString().trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const normalizeList = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

const EMPTY_FORM = { name: "", slug: "", isActive: true };

export default function Brand() {
  const showToast = useToast();

  const [brands, setBrands] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError("");
      setBrands(normalizeList(await getBrands()));
    } catch (err) {
      setError(err.message);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const loadProductCounts = async () => {
    try {
      const products = normalizeList(await getProducts({ limit: 1000 }));
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
  const activeBrands = brands.filter((b) => b.isActive !== false).length;
  const inactiveBrands = brands.filter((b) => b.isActive === false).length;
  const totalProducts = Object.values(productCounts).reduce((sum, c) => sum + c, 0);

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
    setSlugTouched(true);
    setFormError("");
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "slug") setSlugTouched(true);

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "name" && !slugTouched) next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) return setFormError("Brand name is required.");
    if (!form.slug.trim()) return setFormError("Slug is required.");

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
        if (!form.isActive) payload.isActive = false;

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

    setBrands((prev) =>
      prev.map((item) => (item.id === brand.id ? { ...item, isActive: nextIsActive } : item))
    );

    try {
      await updateBrand(brand.id, { isActive: nextIsActive });
    } catch (err) {
      setBrands((prev) =>
        prev.map((item) => (item.id === brand.id ? { ...item, isActive: brand.isActive } : item))
      );
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Brands</h2>
          <p className="text-sm text-ink-soft mt-1">Manage the brands carried in your store.</p>
        </div>

        <Button icon={Plus} onClick={openAddModal}>Add brand</Button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-500 px-4 py-3 rounded-lg text-sm font-medium">{error}</div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total brands" value={totalBrands} icon={Tag} tone="brand" />
        <StatCard label="Active" value={activeBrands} icon={CheckCircle2} tone="brand" />
        <StatCard label="Inactive" value={inactiveBrands} icon={XCircle} tone="rose" />
        <StatCard label="Total products" value={totalProducts} icon={Package} tone="sky" />
      </div>

      <Card className="p-3.5">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center h-11 px-3 rounded-lg bg-paper border border-line focus-within:bg-white focus-within:border-brand-500">
            <Search className="w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full ml-2 bg-transparent outline-none text-sm text-ink placeholder:text-ink-faint"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 px-4 rounded-lg border border-line bg-white text-sm font-medium text-ink-soft outline-none focus:border-brand-500"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      {loading ? (
        <Card className="p-14 text-center text-sm text-ink-soft">Loading brands...</Card>
      ) : filteredBrands.length === 0 ? (
        <Card>
          <EmptyState icon={Tag} title="No brands found" description="Try changing your search or filter." />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="hidden md:block overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line bg-paper/70">
                    {["Brand", "Slug", "Products", "Status", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-4 text-[11px] font-bold uppercase tracking-wide text-ink-faint ${
                          i === 2 || i === 3 ? "text-center" : i === 4 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredBrands.map((brand) => {
                    const isActive = brand.isActive !== false;
                    const productCount = productCounts[brand.id] || 0;

                    return (
                      <tr key={brand.id} className="border-b border-line/70 last:border-0 hover:bg-paper/50 transition">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-paper flex items-center justify-center shrink-0">
                              <Tag className="w-5 h-5 text-ink-faint" />
                            </div>
                            <p className="text-sm font-bold text-ink">{brand.name}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm text-ink-soft">{brand.slug}</p>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <Badge tone="brand">{productCount}</Badge>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <button onClick={() => toggleStatus(brand)}>
                            <Badge tone={isActive ? "brand" : "rose"} dot>
                              {isActive ? "Active" : "Inactive"}
                            </Badge>
                          </button>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end items-center gap-1">
                            <IconAction icon={Eye} label="View" onClick={() => { setSelectedBrand(brand); setViewModalOpen(true); }} />
                            <IconAction icon={Pencil} label="Edit" onClick={() => openEditModal(brand)} />
                            <IconAction icon={Trash2} label="Delete" tone="danger" onClick={() => { setSelectedBrand(brand); setDeleteError(""); setDeleteModalOpen(true); }} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredBrands.map((brand) => {
              const isActive = brand.isActive !== false;
              const productCount = productCounts[brand.id] || 0;

              return (
                <Card key={brand.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-14 h-14 rounded-lg bg-paper shrink-0 flex items-center justify-center">
                      <Tag className="w-5 h-5 text-ink-faint" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-bold text-ink">{brand.name}</h3>
                          <p className="text-xs text-ink-faint mt-1">{brand.slug}</p>
                        </div>

                        <button onClick={() => toggleStatus(brand)}>
                          <Badge tone={isActive ? "brand" : "rose"} dot>{isActive ? "active" : "inactive"}</Badge>
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs text-ink-soft">
                          <span className="font-bold text-ink">{productCount}</span> products
                        </span>

                        <div className="flex items-center gap-1">
                          <IconAction icon={Eye} label="View" onClick={() => { setSelectedBrand(brand); setViewModalOpen(true); }} />
                          <IconAction icon={Pencil} label="Edit" onClick={() => openEditModal(brand)} />
                          <IconAction icon={Trash2} label="Delete" tone="danger" onClick={() => { setSelectedBrand(brand); setDeleteError(""); setDeleteModalOpen(true); }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      {modalOpen && (
        <Modal
          title={editingBrand ? "Edit brand" : "Add brand"}
          description={editingBrand ? "Update brand details." : "Add a new brand to your catalog."}
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)} disabled={saving}>Cancel</Button>
              <Button type="submit" form="brand-form" loading={saving}>
                {saving ? "Saving..." : editingBrand ? "Update brand" : "Create brand"}
              </Button>
            </>
          }
        >
          <form id="brand-form" onSubmit={handleSubmit}>
            {formError && (
              <div className="bg-rose-50 text-rose-500 px-3 py-2.5 rounded-lg text-sm font-medium mb-4">{formError}</div>
            )}

            <Field label="Brand name" required>
              <Input name="name" value={form.name} onChange={handleFormChange} placeholder="Enter brand name" />
            </Field>

            <Field label="Slug" required hint="Auto-filled from the name — edit it directly if you need something different.">
              <Input name="slug" value={form.slug} onChange={handleFormChange} placeholder="brand-slug" />
            </Field>

            <Field label="Status">
              <Select
                name="isActive"
                value={form.isActive ? "active" : "inactive"}
                onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.value === "active" }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </Field>
          </form>
        </Modal>
      )}

      {viewModalOpen && selectedBrand && (
        <Modal title={selectedBrand.name} description={selectedBrand.slug} onClose={() => setViewModalOpen(false)} width="sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <Badge tone={selectedBrand.isActive !== false ? "brand" : "rose"}>
              {selectedBrand.isActive !== false ? "active" : "inactive"}
            </Badge>
          </div>

          <div className="mt-5 p-4 rounded-lg bg-paper flex items-center justify-between">
            <span className="text-sm text-ink-soft">Total products</span>
            <span className="text-lg font-extrabold text-ink">{productCounts[selectedBrand.id] || 0}</span>
          </div>
        </Modal>
      )}

      {deleteModalOpen && selectedBrand && (
        <Modal
          title="Delete brand?"
          onClose={() => setDeleteModalOpen(false)}
          width="sm"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} disabled={deleting}>Cancel</Button>
              <Button variant="danger" loading={deleting} onClick={handleDelete}>Delete</Button>
            </>
          }
        >
          <p className="text-sm text-ink-soft">
            Are you sure you want to delete <strong className="text-ink">{selectedBrand.name}</strong>? Products
            using this brand will keep their data, but lose the brand association.
          </p>

          {deleteError && (
            <div className="bg-rose-50 text-rose-500 px-3 py-2.5 rounded-lg text-sm font-medium mt-4">{deleteError}</div>
          )}
        </Modal>
      )}
    </div>
  );
}

function IconAction({ icon: Icon, label, onClick, tone = "default" }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center text-ink-faint transition ${
        tone === "danger" ? "hover:bg-rose-50 hover:text-rose-500" : "hover:bg-brand-50 hover:text-brand-700"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}