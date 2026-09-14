import { useState } from "react";
import {
  User,
  Store,
  Bell,
  Lock,
  Settings as SettingsIcon,
  Save,
  Camera,
  Eye,
  EyeOff,
} from "lucide-react";
import { Card } from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Field, Input, Select, Textarea } from "../components/ui/Field";
import { useToast } from "../components/ui/Toast";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "store", label: "Store settings", icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Lock },
  { id: "preferences", label: "Preferences", icon: SettingsIcon },
];

export default function Settings() {
  const showToast = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: "Admin Seller",
    email: "seller@cdshopping.com",
    phone: "+91 98765 43210",
    role: "Store Manager",
  });

  const [store, setStore] = useState({
    name: "CD Shopping",
    email: "support@cdshopping.com",
    phone: "+91 98765 43210",
    address: "Dehradun, Uttarakhand, India",
    currency: "INR",
  });

  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: true,
    lowStock: true,
    customers: false,
  });

  const [passwords, setPasswords] = useState({ current: "", newPassword: "", confirm: "" });

  const handleSave = () => showToast("Settings saved successfully");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-ink">Settings</h2>
        <p className="text-sm text-ink-soft mt-1">Manage your account, store and application settings.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-64 shrink-0">
          <Card className="p-2">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-semibold text-left transition ${
                    active ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-paper hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </Card>
        </div>

        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <SettingsCard title="Profile settings" description="Update your personal account information." onSave={handleSave}>
              <div className="flex items-center gap-4 pb-6 border-b border-line">
                <div className="relative">
                  <div className="w-20 h-20 rounded-xl bg-brand-600 flex items-center justify-center text-white text-xl font-extrabold">
                    AS
                  </div>
                  <button className="absolute -right-2 -bottom-2 w-8 h-8 rounded-lg bg-card border border-line shadow-float flex items-center justify-center text-ink-soft hover:text-brand-600">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-bold text-ink">{profile.name}</p>
                  <p className="text-xs text-ink-faint mt-1">{profile.role}</p>
                  <p className="text-xs text-brand-600 mt-2">JPG, PNG or WEBP. Max 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 mt-4">
                <Field label="Full name">
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
                </Field>
                <Field label="Email address">
                  <Input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
                </Field>
                <Field label="Phone number">
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                </Field>
                <Field label="Role">
                  <Input value={profile.role} disabled />
                </Field>
              </div>
            </SettingsCard>
          )}

          {activeTab === "store" && (
            <SettingsCard title="Store settings" description="Manage your store information and contact details." onSave={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Field label="Store name">
                  <Input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
                </Field>
                <Field label="Store email">
                  <Input type="email" value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} />
                </Field>
                <Field label="Store phone">
                  <Input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} />
                </Field>
                <Field label="Currency">
                  <Select value={store.currency} onChange={(e) => setStore({ ...store, currency: e.target.value })}>
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </Select>
                </Field>
                <div className="md:col-span-2">
                  <Field label="Store address">
                    <Textarea rows={4} value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} />
                  </Field>
                </div>
              </div>
            </SettingsCard>
          )}

          {activeTab === "notifications" && (
            <SettingsCard title="Notification settings" description="Choose which notifications you want to receive." onSave={handleSave}>
              <div className="divide-y divide-line">
                <ToggleRow title="New orders" description="Get notified whenever a new order is placed." checked={notifications.orders} onChange={() => setNotifications({ ...notifications, orders: !notifications.orders })} />
                <ToggleRow title="Promotions" description="Receive updates about promotions and offers." checked={notifications.promotions} onChange={() => setNotifications({ ...notifications, promotions: !notifications.promotions })} />
                <ToggleRow title="Low stock alerts" description="Get notified when products are running low." checked={notifications.lowStock} onChange={() => setNotifications({ ...notifications, lowStock: !notifications.lowStock })} />
                <ToggleRow title="Customer updates" description="Receive notifications about customer activity." checked={notifications.customers} onChange={() => setNotifications({ ...notifications, customers: !notifications.customers })} />
              </div>
            </SettingsCard>
          )}

          {activeTab === "security" && (
            <SettingsCard title="Security" description="Update your password and secure your account." onSave={handleSave}>
              <div className="space-y-1 max-w-xl">
                <PasswordField label="Current password" value={passwords.current} onChange={(v) => setPasswords({ ...passwords, current: v })} showPassword={showPassword} setShowPassword={setShowPassword} />
                <PasswordField label="New password" value={passwords.newPassword} onChange={(v) => setPasswords({ ...passwords, newPassword: v })} showPassword={showPassword} setShowPassword={setShowPassword} />
                <PasswordField label="Confirm new password" value={passwords.confirm} onChange={(v) => setPasswords({ ...passwords, confirm: v })} showPassword={showPassword} setShowPassword={setShowPassword} />
              </div>

              <div className="mt-6 p-4 rounded-lg bg-brand-50 border border-brand-200">
                <p className="text-xs font-bold text-brand-800">Password requirements</p>
                <ul className="mt-2 space-y-1 text-xs text-brand-700">
                  <li>• At least 8 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                </ul>
              </div>
            </SettingsCard>
          )}

          {activeTab === "preferences" && (
            <SettingsCard title="Preferences" description="Customize your admin panel experience." onSave={handleSave}>
              <div className="space-y-4 max-w-md">
                <Field label="Language">
                  <Select defaultValue="English">
                    <option>English</option>
                    <option>Hindi</option>
                  </Select>
                </Field>
                <Field label="Timezone">
                  <Select defaultValue="Asia/Kolkata (IST)">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </Select>
                </Field>
                <Field label="Date format">
                  <Select defaultValue="DD/MM/YYYY">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </Select>
                </Field>
              </div>
            </SettingsCard>
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsCard({ title, description, children, onSave }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 sm:px-6 py-5 border-b border-line">
        <h3 className="text-base sm:text-lg font-extrabold text-ink">{title}</h3>
        <p className="text-xs text-ink-soft mt-1">{description}</p>
      </div>

      <div className="p-5 sm:p-6">{children}</div>

      <div className="px-5 sm:px-6 py-4 border-t border-line flex justify-end">
        <Button icon={Save} onClick={onSave}>Save changes</Button>
      </div>
    </Card>
  );
}

function PasswordField({ label, value, onChange, showPassword, setShowPassword }) {
  return (
    <Field label={label}>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter password"
          className="pr-11"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink transition"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </Field>
  );
}

function ToggleRow({ title, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-xs text-ink-faint mt-1">{description}</p>
      </div>

      <button
        type="button"
        onClick={onChange}
        aria-pressed={checked}
        className={`relative w-11 h-6 rounded-full shrink-0 transition ${checked ? "bg-brand-600" : "bg-line"}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}