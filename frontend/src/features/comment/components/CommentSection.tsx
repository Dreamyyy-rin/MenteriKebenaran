import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { DiscussionItem } from "@/types/news";

interface CommentSectionProps {
  newsId: string;
}

export function CommentSection({ newsId }: CommentSectionProps) {
  const [comments, setComments] = useState<DiscussionItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  const currentUser = userJson ? JSON.parse(userJson) : null;

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!token) {
      alert("Silakan login terlebih dahulu untuk mengirim komentar.");
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
      } else {
        alert("Gagal mengirim komentar: " + (data.error || "Terjadi kesalahan"));
      }
    } catch (error) {
      console.error("Error submit comment:", error);
      alert("Koneksi gagal saat mengirim komentar.");
    } finally {
      setSubmitting(false);
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
    <section className="space-y-8 pt-8 border-t">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold tracking-tight">
          Forum Diskusi ({comments.length})
        </h3>
      </div>

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

      {loading ? (
        <p className="text-sm text-muted-foreground animate-pulse">Memuat diskusi...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">
          Belum ada tanggapan. Jadilah yang pertama berdiskusi!
        </p>
      ) : (
        <div className="space-y-6 pt-4">
          {comments.map((item, index) => (
            <div key={item._id || index} className="space-y-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">
                    {item.userId?.fullName?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {item.userId?.fullName || item.userId?.username || "Pengguna"}
                    </span>
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
              {index < comments.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
