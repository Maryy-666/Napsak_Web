"use client";

import React, { useEffect, useState } from "react";
import { Mail, RefreshCw, Check, Trash2 } from "lucide-react";

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function MesajlarPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/messages", {
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Mesajlar alınamadı.");
      }

      setMessages(Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("MESSAGES GET ERROR:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Mesajlar alınırken hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Mesaj güncellenemedi.");
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, isRead: true } : message
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm("Bu mesajı silmek istediğinize emin misiniz?")) {
      return;
    }

    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Mesaj silinemedi.");
      }

      setMessages((current) =>
        current.filter((message) => message.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 select-none font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/10 text-[#0A5C3A] flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>

          <div>
            <h1 className="text-2xl font-bold font-headings">
              Mesaj Yönetimi
            </h1>
            <p className="text-xs opacity-70 mt-1">
              İletişim formundan gelen mesajları yönetin.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchMessages}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-[#0A5C3A] hover:bg-[#084A2F] text-white text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
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
          <h2 className="font-bold font-headings">Gelen Mesajlar</h2>
          <p className="text-xs text-slate-500 mt-1">
            {messages.length} mesaj
          </p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Mesajlar yükleniyor...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="w-10 h-10 mx-auto text-slate-300 mb-3" />
            <h3 className="font-bold text-slate-600">
              Henüz mesaj yok
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              İletişim formundan gelen mesajlar burada görünecek.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-5 transition-colors ${
                  message.isRead ? "bg-white" : "bg-emerald-50/40"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#0F1115]">
                        {message.subject || "Konu belirtilmemiş"}
                      </h3>

                      {!message.isRead && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          YENİ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 mt-1">
                      {message.name} · {message.email}
                    </p>

                    <p className="text-sm text-slate-700 mt-4 whitespace-pre-wrap">
                      {message.content}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-4">
                      {new Date(message.createdAt).toLocaleString("tr-TR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!message.isRead && (
                      <button
                        type="button"
                        onClick={() => markAsRead(message.id)}
                        className="px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        Okundu
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteMessage(message.id)}
                      className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Trash2 className="w-4 h-4" />
                      Sil
                    </button>
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