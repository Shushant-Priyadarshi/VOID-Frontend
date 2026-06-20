import { Heart, MessageCircle, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import { Link } from "react-router-dom";

interface Props {
  post: Post;
  onLikeToggle: (postId: string) => void;
}

export default function PostCard({ post, onLikeToggle }: Props) {
  const { withAuth, promptOpen, setPromptOpen } = useRequireAuth();
  const navigate = useNavigate();

  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        {post.isAnonymous ? (
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-muted">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <Link
            to={`/u/${post.author?.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar className="h-9 w-9 transition-opacity hover:opacity-80">
              <AvatarImage src={post.author?.profileImage ?? undefined} />
              <AvatarFallback>
                {post.author?.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
        )}

        <div className="min-w-0 flex-1">
          {post.isAnonymous ? (
            <p className="text-sm font-medium leading-tight">Anonymous</p>
          ) : (
            <Link
              to={`/u/${post.author?.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-sm font-medium leading-tight hover:underline"
            >
              {post.author?.name}
            </Link>
          )}
          <p className="text-xs text-muted-foreground">
            {post.isAnonymous
              ? post.anonymousLabel
              : formatRelativeTime(post.createdAt)}
          </p>
        </div>
      </div>

      <p
        className="mt-3 cursor-pointer whitespace-pre-wrap text-sm leading-relaxed"
        onClick={() => withAuth(() => navigate(`/post/${post.id}`))}
      >
        {post.content}
      </p>

      {!post.isAnonymous && post.imageUrl && (
        <img
          src={post.imageUrl}
          alt="Post attachment"
          className="mt-3 max-h-96 w-full rounded-lg object-cover"
        />
      )}

      <div className="mt-4 flex items-center gap-4 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 gap-1.5 px-2", post.likedByMe && "text-rose-500")}
          onClick={() => withAuth(() => onLikeToggle(post.id))}
        >
          <Heart className={cn("h-4 w-4", post.likedByMe && "fill-current")} />
          {post.likeCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 px-2"
          onClick={() => withAuth(() => navigate(`/post/${post.id}`))}
        >
          <MessageCircle className="h-4 w-4" />
          {post.commentCount}
        </Button>
      </div>

      <AuthPromptDialogLazy open={promptOpen} onOpenChange={setPromptOpen} />
    </article>
  );
}

// avoids re-importing in every card instance issue; simple direct import alias
import AuthPromptDialog from "@/components/common/AuthPromptDialog";
function AuthPromptDialogLazy(props: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return <AuthPromptDialog {...props} />;
}
