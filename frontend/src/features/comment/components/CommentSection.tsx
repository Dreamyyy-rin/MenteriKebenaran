import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MoreVertical, Trash2, AlertTriangle, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import type { DiscussionItem } from "@/types/news";

interface CommentSectionProps {
  newsId: string;
}

export function CommentSection({ newsId }: CommentSectionProps) {
  const [comments, setComments] = useState<DiscussionItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Reply state
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [collapsedThreads, setCollapsedThreads] = useState<Set<string>>(new Set());

  // Delete state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const replyInputRef = useRef<HTMLTextAreaElement>(null);

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const currentUser = userJson ? JSON.parse(userJson) : null;
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-focus reply input
  useEffect(() => {
    if (replyingTo && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [replyingTo]);

  // Fetch comments
  useEffect(() => {
    async function fetchDiscussions() {
      if (!newsId) return;
      try {
        const res = await fetch(`/api/news/${newsId}/discussions`);
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

  // Group comments: root comments + their replies
  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) =>
    comments.filter((c) => c.parentId === parentId);

  const toggleThread = (commentId: string) => {
    setCollapsedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  // Submit root comment
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      toast.error("Login Diperlukan", {
        description: "Silakan login terlebih dahulu untuk mengirim komentar.",
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/news/${newsId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment }),
      });

      const data = await res.json();

      if (res.ok) {
        const created: DiscussionItem = data.discussion || {
          _id: Date.now().toString(),
          newsId,
          userId: {
            _id: currentUser?._id || "temp",
            fullName: currentUser?.fullName || "User",
            username: currentUser?.username || "user",
          },
          comment: newComment,
          parentId: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setComments((prev) => [...prev, created]);
        setNewComment("");
        toast.success("Komentar Terkirim!");
      } else {
        toast.error("Gagal Mengirim", {
          description: data.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      console.error("Error submit comment:", error);
      toast.error("Koneksi Gagal", { description: "Gagal mengirim komentar." });
    } finally {
      setSubmitting(false);
    }
  }

  // Submit reply
  async function handleSubmitReply(parentId: string) {
    if (!replyText.trim()) return;

    if (!token) {
      toast.error("Login Diperlukan", {
        description: "Silakan login untuk membalas komentar.",
      });
      return;
    }

    setSubmittingReply(true);
    try {
      const res = await fetch(`/api/news/${newsId}/discussions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: replyText, parentId }),
      });

      const data = await res.json();

      if (res.ok) {
        const created: DiscussionItem = data.discussion || {
          _id: Date.now().toString(),
          newsId,
          userId: {
            _id: currentUser?._id || "temp",
            fullName: currentUser?.fullName || "User",
            username: currentUser?.username || "user",
          },
          comment: replyText,
          parentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setComments((prev) => [...prev, created]);
        // Expand thread after replying
        setCollapsedThreads((prev) => {
          const next = new Set(prev);
          next.delete(parentId);
          return next;
        });
        setReplyText("");
        setReplyingTo(null);
        toast.success("Balasan Terkirim!");
      } else {
        toast.error("Gagal Membalas", {
          description: data.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      console.error("Error submit reply:", error);
      toast.error("Koneksi Gagal", { description: "Gagal mengirim balasan." });
    } finally {
      setSubmittingReply(false);
    }
  }

  // Delete comment
  async function handleDeleteComment(commentId: string) {
    if (!token) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/discussions/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove comment and its replies from local state
        setComments((prev) =>
          prev.filter((item) => item._id !== commentId && item.parentId !== commentId)
        );
        setConfirmDeleteId(null);
        setActiveMenuId(null);
        toast.success("Komentar dihapus!");
      } else {
        const data = await res.json();
        toast.error("Gagal Menghapus", {
          description: data.error || "Akses ditolak",
        });
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Gagal Menghapus", {
        description: "Terjadi kesalahan jaringan.",
      });
    } finally {
      setDeleting(false);
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

  const canDeleteComment = (item: DiscussionItem) => {
    if (!currentUser) return false;
    const isOwner =
      item.userId?._id === currentUser._id ||
      item.userId?.username === currentUser.username ||
      item.userId?.fullName === currentUser.fullName;
    return isOwner || isAdmin;
  };

  // Render a single comment card (used for both root + reply)
  const renderCommentCard = (
    item: DiscussionItem,
    isReply: boolean = false
  ) => {
    const replies = getReplies(item._id);
    const isCollapsed = collapsedThreads.has(item._id);
    const isReplying = replyingTo === item._id;

    return (
      <div key={item._id} className={isReply ? "ml-10 mt-3" : ""}>
        <div className="flex items-start justify-between gap-4 group">
          <div className="flex items-start gap-3 flex-1">
            {/* Avatar */}
            <Avatar className={isReply ? "h-7 w-7 border shrink-0" : "h-9 w-9 border shrink-0"}>
              <AvatarFallback
                className={`${
                  isReply
                    ? "bg-muted text-foreground text-[10px] font-semibold"
                    : "bg-muted text-foreground text-xs font-semibold"
                }`}
              >
                {item.userId?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-1">
              {/* Author & time */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`font-semibold text-foreground ${isReply ? "text-xs" : "text-sm"}`}>
                  {item.userId?.fullName || item.userId?.username || "Pengguna"}
                </span>
                {isReply && (
                  <span className="text-[10px] font-medium text-primary/70 bg-primary/10 px-1.5 py-0.5 rounded-full">
                    Membalas
                  </span>
                )}
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</span>
              </div>

              {/* Comment text */}
              <p className={`text-foreground/90 leading-relaxed font-normal ${isReply ? "text-xs" : "text-sm"}`}>
                {item.comment}
              </p>

              {/* Action bar */}
              <div className="flex items-center gap-3 pt-1">
                {token && !isReply && (
                  <button
                    onClick={() => {
                      setReplyingTo(isReplying ? null : item._id);
                      setReplyText("");
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <Reply className="w-3 h-3" />
                    Balas
                  </button>
                )}
                {replies.length > 0 && !isReply && (
                  <button
                    onClick={() => toggleThread(item._id)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  >
                    {isCollapsed ? (
                      <ChevronDown className="w-3 h-3" />
                    ) : (
                      <ChevronUp className="w-3 h-3" />
                    )}
                    {isCollapsed
                      ? `Lihat ${replies.length} balasan`
                      : `Sembunyikan balasan`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Kebab menu */}
          {canDeleteComment(item) && (
            <div
              className="relative shrink-0"
              ref={activeMenuId === item._id ? menuRef : null}
            >
              <button
                onClick={() =>
                  setActiveMenuId(activeMenuId === item._id ? null : item._id)
                }
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                title="Opsi"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {activeMenuId === item._id && (
                <div className="absolute right-0 mt-1 w-40 rounded-xl bg-card border shadow-lg py-1 z-20 animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => {
                      setActiveMenuId(null);
                      setConfirmDeleteId(item._id);
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

        {/* Inline reply form */}
        {isReplying && token && (
          <div className="ml-12 mt-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-1 bg-muted/20 p-3 rounded-2xl border border-border/40">
            <Avatar className="h-8 w-8 border shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                {currentUser?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <textarea
                ref={replyInputRef}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Balas komentar ${item.userId?.fullName || "ini"}...`}
                rows={2}
                className="w-full rounded-xl border border-input/50 bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 focus-visible:border-primary/40 resize-none shadow-sm"
              />
              <div className="flex items-center gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null);
                    setReplyText("");
                  }}
                  className="h-7 text-xs rounded-lg px-3"
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  disabled={submittingReply || !replyText.trim()}
                  onClick={() => handleSubmitReply(item._id)}
                  className="h-7 text-xs rounded-lg px-3 gap-1"
                >
                  <Reply className="w-3 h-3" />
                  {submittingReply ? "Mengirim..." : "Kirim Balasan"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Replies thread */}
        {!isReply && replies.length > 0 && !isCollapsed && (
          <div className="mt-3 pl-1 border-l-2 border-primary/20 ml-4 space-y-4 rounded-bl-lg">
            {replies.map((reply) => renderCommentCard(reply, true))}
          </div>
        )}
      </div>
    );
  }

  return (
    <section className="pt-8 pb-16">
      <div className="bg-card border border-border/50 shadow-sm rounded-3xl p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <h3 className="text-2xl font-bold tracking-tight">
            Forum Diskusi <span className="text-muted-foreground text-lg font-medium">({rootComments.length})</span>
          </h3>
        </div>

      {/* Root comment input */}
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
                className="w-full rounded-xl border border-input bg-background p-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="rounded-full"
                >
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
            <Button variant="default" className="rounded-full">
              Login Sekarang
            </Button>
          </Link>
        </div>
      )}

      {/* Comment list */}
      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">
          Memuat diskusi...
        </p>
      ) : rootComments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Belum ada tanggapan. Jadilah yang pertama berdiskusi!
        </p>
      ) : (
        <div className="space-y-6 pt-4">
          {rootComments.map((item, index) => (
            <div key={item._id}>
              {renderCommentCard(item)}
              {index < rootComments.length - 1 && (
                <Separator className="mt-6 bg-border/40" />
              )}
            </div>
          ))}
        </div>
      )}
      </div>

      {/* Delete confirmation modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-card border rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2.5 rounded-full bg-destructive/10">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-lg text-foreground">Hapus Komentar?</h4>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Apakah Anda yakin ingin menghapus komentar ini? Semua balasan pada
              komentar ini juga akan terhapus.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteId(null)}
                disabled={deleting}
                className="rounded-full text-xs"
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteComment(confirmDeleteId)}
                disabled={deleting}
                className="rounded-full text-xs gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                {deleting ? "Menghapus..." : "Ya, Hapus"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
