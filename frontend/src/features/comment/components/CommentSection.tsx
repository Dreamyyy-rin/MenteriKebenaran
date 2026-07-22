import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/toast";
import type { DiscussionItem } from "@/types/news";

interface CommentSectionProps {
  newsId: string;
}

export function CommentSection({ newsId }: CommentSectionProps) {
  const [comments, setComments] = useState<DiscussionItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State untuk Dropdown Menu
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const currentUser = userJson ? JSON.parse(userJson) : null;
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Menutup popup dropdown saat klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch daftar komentar
  useEffect(() => {
    async function fetchDiscussions() {
      if (!newsId) return;
      try {
        const res = await fetch(`http://localhost:5000/api/news/${newsId}/discussions`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          setComments(data);
        } else if (data.discussions && Array.isArray(data.discussions)) {
          setComments(data.discussions);
        }
      } catch (error) {
        console.error("Gagal mengambil komentar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDiscussions();
  }, [newsId]);

  // Submit Komentar Baru
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      toast.error("Akses Ditolak", "Silakan login terlebih dahulu untuk mengirim komentar.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/news/${newsId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await res.json();

      if (res.ok) {
        const createdComment: DiscussionItem = data.discussion || data.comment || {
          _id: Date.now().toString(),
          newsId,
          userId: {
            _id: currentUser?._id || "temp",
            fullName: currentUser?.fullName || "User",
            username: currentUser?.username || "user",
          },
          comment: newComment,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setComments((prev) => [createdComment, ...prev]);
        setNewComment("");
        toast.success("Berhasil", "Komentar terkirim!");
      } else {
        toast.error("Gagal Mengirim", data.error || "Terjadi kesalahan");
      }
    } catch (error) {
      console.error("Error submit comment:", error);
      toast.error("Error", "Koneksi gagal saat mengirim komentar.");
    } finally {
      setSubmitting(false);
    }
  }

  // Fungsi Eksekusi Hapus Komentar ke API backend
  async function handleDeleteComment(commentId: string) {
    if (!token) return;

    try {
      const res = await fetch(`http://localhost:5000/api/discussions/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        // Hapus komentar dari list lokal secara instan
        setComments((prev) => prev.filter((item) => item._id !== commentId));
        setActiveMenuId(null);
        toast.success("Berhasil", "Komentar dihapus!");
      } else {
        const data = await res.json();
        toast.error("Gagal Menghapus", data.error || "Akses ditolak");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error", "Terjadi kesalahan jaringan saat menghapus komentar.");
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="space-y-8 pt-8 border-t relative">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">
          Forum Diskusi ({comments.length})
        </h3>
      </div>

      {/* FORM INPUT KOMENTAR */}
      {token ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10 border">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {currentUser?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Tuliskan pendapat atau tanggapanmu..."
                rows={3}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={submitting || !newComment.trim()} className="rounded-full">
                  {submitting ? "Mengirim..." : "Kirim Komentar"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="rounded-2xl border bg-muted/30 p-6 text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            Ingin ikut berdiskusi dan memberikan pendapatmu?
          </p>
          <Link to="/login">
            <Button variant="default" className="rounded-full">Login Sekarang</Button>
          </Link>
        </div>
      )}

      {/* DAFTAR KOMENTAR */}
      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Memuat diskusi...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Belum ada tanggapan. Jadilah yang pertama berdiskusi!
        </p>
      ) : (
        <div className="space-y-6 pt-4">
          {comments.map((item, index) => {
            const commentUserId = typeof item.userId === "object" ? item.userId?._id : item.userId;
            const commentUsername = typeof item.userId === "object" ? item.userId?.username : undefined;
            const commentFullName = typeof item.userId === "object" ? item.userId?.fullName : undefined;

            const isOwner = Boolean(
              currentUser &&
                ((commentUserId && currentUser._id && String(commentUserId) === String(currentUser._id)) ||
                 (commentUsername && currentUser.username && commentUsername === currentUser.username) ||
                 (commentFullName && currentUser.fullName && commentFullName === currentUser.fullName))
            );
            const canDelete = isOwner || isAdmin;

            return (
              <div key={item._id || index} className="space-y-4">
                <div className="flex items-start justify-between gap-4 group">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-9 w-9 border">
                      <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                        {item.userId?.fullName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {item.userId?.fullName || item.userId?.username || "Pengguna"}
                        </span>
                        {isOwner && (
                          <span className="text-[10px] font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                            Anda
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(item.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed font-normal pt-1">
                        {item.comment}
                      </p>
                    </div>
                  </div>

                  {/* POPUP TITIK TIGA HANYA JIKA PUNYA HAK HAPUS (Milik Sendiri / Admin) */}
                  {canDelete && (
                    <div className="relative" ref={activeMenuId === item._id ? menuRef : null}>
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === item._id ? null : item._id)}
                        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        title="Opsi Komentar"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Menu Popover Dropdown */}
                      {activeMenuId === item._id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-xl bg-card border border-border shadow-lg py-1 z-20 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              toast.confirm({
                                title: "Hapus Komentar?",
                                message: "Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan.",
                                variant: "destructive",
                                confirmText: "Ya, Hapus",
                                cancelText: "Batal",
                                icon: <Trash2 className="w-6 h-6 text-destructive" />,
                                onConfirm: () => handleDeleteComment(item._id),
                              });
                            }}
                            className="w-full text-left px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus Komentar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {index < comments.length - 1 && <Separator className="mt-4" />}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

