"use client";

import { useEffect, useState } from "react";

interface Props {
  onSaved: (profile: {
    firstName: string;
    lastName: string;
    customerNumber: string;
  }) => void;
}

export default function UserProfileForm({ onSaved }: Props) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    customerNumber: "",
  });

  const [loading, setLoading] = useState(false);

  // Load existing profile
  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.firstName) {
          setForm(data);
          onSaved(data);
        }
      });
  }, [onSaved]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      onSaved(data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">User Profile</h2>

      {["firstName", "lastName", "customerNumber"].map((key) => (
        <div key={key}>
          <label className="block text-sm font-medium capitalize mb-1">
            {key.replace(/([A-Z])/g, " $1")}
          </label>
          <input
            type="text"
            name={key}
            value={form[key as keyof typeof form]}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-orange-600 text-white px-5 py-2 rounded-md hover:bg-orange-700"
      >
        {loading ? "Saving..." : "Save"}
      </button>
    </div>
  );
}
