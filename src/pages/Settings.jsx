import { useState } from "react";
import { Bell, Building2, Clock3, Save } from "lucide-react";

const initialSettings = {
  clinicName: "Gupta Homeo Clinic",
  consultationFee: "300",
  appointmentDuration: "30",
  emailNotifications: true,
  paymentNotifications: true,
};

export default function Settings() {
  const [settings, setSettings] = useState(initialSettings);
  const [saved, setSaved] = useState(false);

  const updateSetting = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSave = (event) => {
    event.preventDefault();
    // Settings are currently managed in this page only; no settings API exists yet.
    setSaved(true);
  };

  return (
    <section className="mx-auto max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="mt-2 text-gray-500">Manage clinic details and appointment preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Building2 size={21} /></span>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Clinic information</h2>
              <p className="text-sm text-gray-500">Basic details used in the admin workspace.</p>
            </div>
          </div>
          <label className="block max-w-xl text-sm font-medium text-gray-700" htmlFor="clinicName">Clinic name</label>
          <input id="clinicName" name="clinicName" value={settings.clinicName} onChange={updateSetting} className="mt-2 w-full max-w-xl rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Clock3 size={21} /></span>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Appointment defaults</h2>
              <p className="text-sm text-gray-500">Default values for new clinic appointments.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="consultationFee">Consultation fee (₹)</label>
              <input id="consultationFee" name="consultationFee" type="number" min="0" value={settings.consultationFee} onChange={updateSetting} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="appointmentDuration">Appointment duration (minutes)</label>
              <input id="appointmentDuration" name="appointmentDuration" type="number" min="5" step="5" value={settings.appointmentDuration} onChange={updateSetting} className="mt-2 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><Bell size={21} /></span>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
              <p className="text-sm text-gray-500">Choose which updates to show in your preferences.</p>
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <span><span className="block font-medium text-gray-800">Appointment updates</span><span className="text-sm text-gray-500">New and changed appointment notifications</span></span>
              <input type="checkbox" name="emailNotifications" checked={settings.emailNotifications} onChange={updateSetting} className="h-5 w-5 accent-emerald-700" />
            </label>
            <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-100 p-4">
              <span><span className="block font-medium text-gray-800">Payment updates</span><span className="text-sm text-gray-500">Payments awaiting verification</span></span>
              <input type="checkbox" name="paymentNotifications" checked={settings.paymentNotifications} onChange={updateSetting} className="h-5 w-5 accent-emerald-700" />
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-4">
          {saved && <p role="status" className="text-sm text-emerald-700">Preferences saved for this session.</p>}
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"><Save size={18} />Save preferences</button>
        </div>
      </form>
    </section>
  );
}
