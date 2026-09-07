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
  Check,
} from "lucide-react";

export default function Settings() {
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

  const [passwords, setPasswords] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "store",
      label: "Store Settings",
      icon: Store,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: SettingsIcon,
    },
  ];

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleStoreChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
          Settings
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Manage your account, store and application settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2">

            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-xl
                    text-sm font-semibold text-left transition
                    ${
                      active
                        ? "bg-green-50 text-green-700"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}

          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Profile */}
          {activeTab === "profile" && (
            <SettingsCard
              title="Profile Settings"
              description="Update your personal account information."
              onSave={handleSave}
            >
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">

                <div className="relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-700 to-green-500 flex items-center justify-center text-white text-xl font-extrabold">
                    AS
                  </div>

                  <button className="absolute -right-2 -bottom-2 w-8 h-8 rounded-lg bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-500 hover:text-green-600">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Admin Seller
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Store Manager
                  </p>

                  <p className="text-xs text-green-600 mt-2">
                    JPG, PNG or WEBP. Max 2MB.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  label="Full Name"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />

                <Input
                  label="Role"
                  name="role"
                  value={profile.role}
                  onChange={handleProfileChange}
                  disabled
                />

              </div>
            </SettingsCard>
          )}

          {/* Store */}
          {activeTab === "store" && (
            <SettingsCard
              title="Store Settings"
              description="Manage your store information and contact details."
              onSave={handleSave}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <Input
                  label="Store Name"
                  name="name"
                  value={store.name}
                  onChange={handleStoreChange}
                />

                <Input
                  label="Store Email"
                  name="email"
                  type="email"
                  value={store.email}
                  onChange={handleStoreChange}
                />

                <Input
                  label="Store Phone"
                  name="phone"
                  value={store.phone}
                  onChange={handleStoreChange}
                />

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Currency
                  </label>

                  <select
                    name="currency"
                    value={store.currency}
                    onChange={handleStoreChange}
                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-green-400"
                  >
                    <option value="INR">INR - Indian Rupee</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Store Address
                  </label>

                  <textarea
                    name="address"
                    value={store.address}
                    onChange={handleStoreChange}
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm resize-none focus:border-green-400"
                  />
                </div>

              </div>
            </SettingsCard>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <SettingsCard
              title="Notification Settings"
              description="Choose which notifications you want to receive."
              onSave={handleSave}
            >
              <div className="divide-y divide-gray-100">

                <ToggleRow
                  title="New Orders"
                  description="Get notified whenever a new order is placed."
                  checked={notifications.orders}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      orders: !notifications.orders,
                    })
                  }
                />

                <ToggleRow
                  title="Promotions"
                  description="Receive updates about promotions and offers."
                  checked={notifications.promotions}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      promotions: !notifications.promotions,
                    })
                  }
                />

                <ToggleRow
                  title="Low Stock Alerts"
                  description="Get notified when products are running low."
                  checked={notifications.lowStock}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      lowStock: !notifications.lowStock,
                    })
                  }
                />

                <ToggleRow
                  title="Customer Updates"
                  description="Receive notifications about customer activity."
                  checked={notifications.customers}
                  onChange={() =>
                    setNotifications({
                      ...notifications,
                      customers: !notifications.customers,
                    })
                  }
                />

              </div>
            </SettingsCard>
          )}

          {/* Security */}
          {activeTab === "security" && (
            <SettingsCard
              title="Security"
              description="Update your password and secure your account."
              onSave={handleSave}
            >
              <div className="space-y-5 max-w-xl">

                <PasswordInput
                  label="Current Password"
                  name="current"
                  value={passwords.current}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <PasswordInput
                  label="New Password"
                  name="newPassword"
                  value={passwords.newPassword}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

                <PasswordInput
                  label="Confirm New Password"
                  name="confirm"
                  value={passwords.confirm}
                  onChange={handlePasswordChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />

              </div>

              <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs font-bold text-green-800">
                  Password Requirements
                </p>

                <ul className="mt-2 space-y-1 text-xs text-green-700">
                  <li>• At least 8 characters</li>
                  <li>• Include uppercase and lowercase letters</li>
                  <li>• Include at least one number</li>
                </ul>
              </div>
            </SettingsCard>
          )}

          {/* Preferences */}
          {activeTab === "preferences" && (
            <SettingsCard
              title="Preferences"
              description="Customize your admin panel experience."
              onSave={handleSave}
            >
              <div className="space-y-5">

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Language
                  </label>

                  <select className="w-full max-w-md h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-green-400">
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Timezone
                  </label>

                  <select className="w-full max-w-md h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-green-400">
                    <option>Asia/Kolkata (IST)</option>
                    <option>UTC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Date Format
                  </label>

                  <select className="w-full max-w-md h-11 px-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-green-400">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

              </div>
            </SettingsCard>
          )}

        </div>
      </div>
    </div>
  );
}

/* ---------------- Components ---------------- */

function SettingsCard({
  title,
  description,
  children,
  onSave,
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">

      <div className="px-5 sm:px-6 py-5 border-b border-gray-100">
        <h3 className="text-base sm:text-lg font-extrabold text-gray-900">
          {title}
        </h3>

        <p className="text-xs text-gray-400 mt-1">
          {description}
        </p>
      </div>

      <div className="p-5 sm:p-6">
        {children}
      </div>

      <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-sm font-bold hover:bg-green-700 transition"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  disabled = false,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full h-11 px-3 rounded-xl border border-gray-200
          outline-none text-sm
          ${
            disabled
              ? "bg-gray-50 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 focus:border-green-400"
          }
        `}
      />
    </div>
  );
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
  showPassword,
  setShowPassword,
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder="Enter password"
          className="w-full h-11 px-3 pr-11 rounded-xl border border-gray-200 outline-none text-sm focus:border-green-400"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">

      <div>
        <p className="text-sm font-bold text-gray-800">
          {title}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {description}
        </p>
      </div>

      <button
        type="button"
        onClick={onChange}
        className={`
          relative w-11 h-6 rounded-full shrink-0 transition
          ${checked ? "bg-green-600" : "bg-gray-200"}
        `}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition
            ${checked ? "left-6" : "left-1"}
          `}
        />

        {checked && (
          <Check className="absolute left-1.5 top-1.5 w-3 h-3 text-green-600" />
        )}
      </button>

    </div>
  );
}