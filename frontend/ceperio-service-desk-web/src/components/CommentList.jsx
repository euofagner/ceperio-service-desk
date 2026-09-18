import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { getComments } from "../services/commentService";

function CommentList({ ticketId, refreshKey = 0}) {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function loadComments() {
            setLoading(true);

            try {
                const data = await getComments(ticketId);

                if (!cancelled) {
                    setComments(data);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Erro ao carregar comentários:", error);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        loadComments();

        return () => {
            cancelled = true;
        };
    }, [ticketId, refreshKey]);

    function formatName(name) {
        if (!name) return "";

        return name
            .toLowerCase()
            .trim()
            .split(/\s+/)
            .map(
                (part) =>
                    part.charAt(0).toUpperCase() + part.slice(1)
            )
            .join(" ");
    }

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((item) => (
                    <div
                        key={item}
                        className="flex animate-pulse gap-3">
                        <div className="h-9 w-9 shrink-0 rounded-full bg-neutral-800" />

                        <div className="flex-1 space-y-2">
                            <div className="h-3 w-32 rounded bg-neutral-800" />
                            <div className="h-3 w-3/4 rounded bg-neutral-800" />
                            <div className="h-3 w-1/2 rounded bg-neutral-800" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 px-6 py-10 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800 text-neutral-500">
                    <MessageCircle className="h-5 w-5" />
                </div>

                <p className="text-sm font-medium text-neutral-300">
                    Nenhum comentário ainda
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                    Os comentários deste ticket aparecerão aqui.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {comments.map((comment, index) => {
                const formattedName = formatName(comment.userName);

                const initials = formattedName
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("");

                return (
                    <div
                        key={comment.id}
                        className="group relative flex gap-3">

                        {index !== comments.length - 1 && (
                            <div className="absolute -bottom-5 left-4.25 top-10 w-px bg-neutral-800" />
                        )}

                        {/* avatar color */}
                        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-blue-600 text-[11px] font-bold text-white shadow-lg shadow-blue-500/10 ring-4 ring-neutral-950">
                            {initials || "?"}
                        </div>

                        {/* content */}
                        <div className="min-w-0 flex-1">
                            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 px-4 py-3 transition-colors duration-200 group-hover:border-neutral-700 group-hover:bg-neutral-900">
                                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-neutral-200">
                                            {formattedName}
                                        </span>
                                    </div>

                                    {/* date */}
                                    <time
                                        dateTime={comment.createdAt}
                                        className="text-[13px] font-semibold text-neutral-500">
                                        {new Date(
                                            comment.createdAt
                                        ).toLocaleString("pt-BR", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </time>
                                </div>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-400">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default CommentList;
