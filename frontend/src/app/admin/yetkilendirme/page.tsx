"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, UserCog } from "lucide-react";

interface User {
  id: number;
  name: string | null;
  email: string;
  role: "USER" | "ADMIN";
}

export default function YetkilendirmePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/users", {
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Kullanıcılar alınamadı.");
      }

      setUsers(data);
    } catch (error) {
      console.error("YETKILENDIRME GET ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Kullanıcılar alınırken hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (id: number, role: "USER" | "ADMIN") => {
    try {
      setUpdatingId(id);
      setError("");

      const response = await fetch(`/api/users/${id}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Rol güncellenemedi.");
      }

      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === id ? { ...user, role: data.role } : user
        )
      );
    } catch (error) {
      console.error("ROLE UPDATE ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Rol güncellenirken hata oluştu."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-headings">
              Yetkilendirme
            </h1>
            <p className="text-xs opacity-70 mt-1">
              Kullanıcıların sistem rollerini yönetin.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          Yenile
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200">
          <h2 className="font-bold font-headings">Kullanıcı Yetkileri</h2>
          <p className="text-xs text-slate-500 mt-1">
            Kullanıcıların rollerini buradan değiştirebilirsiniz.
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Kullanıcılar yükleniyor...
          </div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center">
            <UserCog className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-600">
              Kullanıcı bulunamadı
            </h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500">
                    Kullanıcı
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500">
                    E-posta
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500">
                    Mevcut Rol
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-bold text-slate-500">
                    Rol Değiştir
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#0F1115]">
                        {user.name || "İsimsiz Kullanıcı"}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        ID: {user.id}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {user.email}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          user.role === "ADMIN"
                            ? "bg-[#0A5C3A]/10 text-[#0A5C3A]"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Yönetici" : "Kullanıcı"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) =>
                          changeRole(
                            user.id,
                            e.target.value as "USER" | "ADMIN"
                          )
                        }
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none focus:border-[#0A5C3A] disabled:opacity-50"
                      >
                        <option value="USER">Kullanıcı</option>
                        <option value="ADMIN">Yönetici</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}