"use client";

import { useEffect, useState } from "react";
import { generateWhatsAppLink, formatDate, REGIONS } from "@/lib/utils";
import { OrderIcon, WifiIcon } from "@/components/ui/Icons";

interface Order {
  id: string;
  plan: string;
  price: number;
  region: string;
  subLocation: string;
  preferredDate: string;
  status: string;
  createdAt: string;
}

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    plan: "",
    price: 0,
    region: "",
    subLocation: "",
    customSubLocation: "",
    preferredDate: "",
    customerPhoneNumber: "",
    adminNumber: "0762667048",
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (plan: string, price: number) => {
    setFormData({ ...formData, plan, price });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate base fields
    if (!formData.plan || !formData.region || !formData.subLocation || !formData.preferredDate || !formData.customerPhoneNumber) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate custom location if "Others" is selected
    if (formData.subLocation === "Others" && !formData.customSubLocation.trim()) {
      alert("Please specify your location");
      return;
    }

    try {
      setSubmitting(true);

      // Use custom location if "Others" is selected
      const finalSubLocation = formData.subLocation === "Others" ? formData.customSubLocation : formData.subLocation;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: formData.plan,
          price: formData.price,
          region: formData.region,
          subLocation: finalSubLocation,
          preferredDate: formData.preferredDate,
          whatsappNumber: "0" + formData.customerPhoneNumber, // Add leading zero if missing, or use as is. Prefix provided in UI is +254. Assuming user types 7...
          notes: formData.notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const notification = confirm("Order submitted successfully! Click OK to open WhatsApp and send the details to our agent.");

        if (notification) {
          // Open WhatsApp with pre-filled message using selected ADMIN number
          const whatsappMessage = `Hi! I just placed an order (#${data.order.id}) for ${formData.plan} plan. Location: ${finalSubLocation}, ${formData.region}. My number: 0${formData.customerPhoneNumber}. Preferred date: ${formData.preferredDate}`;
          const whatsappLink = generateWhatsAppLink(formData.adminNumber, whatsappMessage);
          window.open(whatsappLink, "_blank");
        }

        // Reset form
        setFormData({
          plan: "",
          price: 0,
          region: "",
          subLocation: "",
          customSubLocation: "",
          preferredDate: "",
          customerPhoneNumber: "",
          adminNumber: "0762667048",
          notes: "",
        });

        fetchOrders();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to submit order");
      }

      fetchOrders();
    } else {
      const data = await res.json();
      alert(data.error || "Failed to submit order");
    }
  } catch (error) {
    console.error("Error submitting order:", error);
    alert("Failed to submit order");
  } finally {
    setSubmitting(false);
  }
};

const getSubLocations = () => {
  if (!formData.region) return [];
  return REGIONS[formData.region as keyof typeof REGIONS]?.subLocations || [];
};

return (
  <div>
    <div className="flex items-center gap-3">
      <OrderIcon size={32} />
      <div>
        <h1 className="text-3xl font-bold text-[#1A1A2E]">Orders</h1>
        <p className="text-[#6B7280]">Order a new plan or view your order history</p>
      </div>
    </div>

    {/* Order Form */}
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl bg-white p-6 shadow-md">
      <h2 className="text-xl font-semibold text-[#1A1A2E]">Order New Installation</h2>

      {/* Plan Selection */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-[#1A1A2E]">
          Select Plan <span className="text-red-500">*</span>
        </label>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="plan"
              checked={formData.plan === "10 Mbps Basic Plan"}
              onChange={() => handlePlanChange("10 Mbps Basic Plan", 1500)}
              className="peer sr-only"
            />
            <div className="rounded-xl border-2 border-gray-200 p-4 transition-all peer-checked:border-[#0066FF] peer-checked:bg-blue-50">
              <div className="flex items-center gap-2 font-semibold text-[#1A1A2E]">
                <WifiIcon size={18} className="text-[#0066FF]" /> 10 Mbps
              </div>
              <div className="mt-1 text-2xl font-bold text-[#0066FF]">KES 1,500/month</div>
              <div className="mt-1 text-sm text-[#6B7280]">Good for browsing & social media</div>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="plan"
              checked={formData.plan === "12 Mbps Premium Plan"}
              onChange={() => handlePlanChange("12 Mbps Premium Plan", 2000)}
              className="peer sr-only"
            />
            <div className="rounded-xl border-2 border-gray-200 p-4 transition-all peer-checked:border-[#0066FF] peer-checked:bg-blue-50">
              <div className="flex items-center gap-2 font-semibold text-[#1A1A2E]">
                <WifiIcon size={18} className="text-[#0066FF]" /> 12 Mbps
              </div>
              <div className="mt-1 text-2xl font-bold text-[#0066FF]">KES 2,000/month</div>
              <div className="mt-1 text-sm text-[#6B7280]">Best for streaming & gaming</div>
            </div>
          </label>
        </div>
      </div>

      {/* Location Details */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Region <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.region}
            onChange={(e) => setFormData({ ...formData, region: e.target.value, subLocation: "" })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            required
          >
            <option value="">Select region</option>
            <option value="kakamega">Kakamega</option>
            <option value="bungoma">Bungoma</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Sub-location <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.subLocation}
            onChange={(e) => setFormData({ ...formData, subLocation: e.target.value, customSubLocation: "" })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            required
            disabled={!formData.region}
          >
            <option value="">Select sub-location</option>
            {getSubLocations().map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Sub-location (if Others selected) */}
        {formData.subLocation === "Others" && (
          <div>
            <label className="block text-sm font-medium text-[#1A1A2E]">
              Specify Your Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customSubLocation}
              onChange={(e) => setFormData({ ...formData, customSubLocation: e.target.value })}
              placeholder="Enter your specific location"
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              required
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Preferred Installation Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.preferredDate}
            onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
            min={new Date().toISOString().split("T")[0]}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Your Phone Number <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <span className="text-gray-500 font-medium">+254</span>
            </div>
            <input
              type="tel"
              value={formData.customerPhoneNumber}
              onChange={(e) => {
                // Allow only numbers and limit length
                const val = e.target.value.replace(/\D/g, '');
                setFormData({ ...formData, customerPhoneNumber: val });
              }}
              placeholder="712 345 678"
              className="w-full rounded-lg border border-gray-300 pl-14 pr-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Send Order To (Support Agent) <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.adminNumber}
            onChange={(e) => setFormData({ ...formData, adminNumber: e.target.value })}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
            required
          >
            <option value="0762667048">Admin 1 (0762667048)</option>
            <option value="0768294174">Admin 2 (0768294174)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1A1A2E]">
            Additional Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Any special instructions?"
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 text-[#1A1A2E] focus:border-[#0066FF] focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-6 w-full rounded-full bg-[#0066FF] py-3 font-semibold text-white transition-colors hover:bg-[#0052CC] disabled:opacity-50"
        disabled={submitting}
      >
        {submitting ? "Submitting..." : "Submit Order -> Continue to WhatsApp"}
      </button>
    </form>

    {/* Order History */}
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-[#1A1A2E]">My Orders</h2>
      {loading ? (
        <div className="mt-4 rounded-xl bg-white p-6 text-center shadow-md">
          <p className="text-[#6B7280]">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-4 rounded-xl bg-white p-6 text-center shadow-md">
          <p className="text-[#6B7280]">No orders yet</p>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl bg-white p-6 shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[#1A1A2E]">{order.plan}</h3>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    {order.subLocation}, {order.region}
                  </p>
                  <p className="mt-1 text-sm text-[#6B7280]">
                    Preferred Date: {formatDate(order.preferredDate)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "installed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <p className="mt-2 text-lg font-bold text-[#0066FF]">
                    KES {order.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);
}
