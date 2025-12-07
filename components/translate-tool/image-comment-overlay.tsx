"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageSquare } from "lucide-react";

interface ImageComment {
  id: string;
  x: number;
  y: number;
  text: string;
  number: number;
}

interface ImageCommentOverlayProps {
  imageUrl: string;
  alt: string;
  comments: ImageComment[];
  isFeedbackMode: boolean;
  onAddComment: (x: number, y: number) => void;
  onSaveComment: (id: string, text: string) => void;
  onDeleteComment: (id: string) => void;
}

export function ImageCommentOverlay({
  imageUrl,
  alt,
  comments,
  isFeedbackMode,
  onAddComment,
  onSaveComment,
  onDeleteComment,
}: ImageCommentOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleImageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isFeedbackMode || !containerRef.current) return;

      // Prevent clicking on existing markers
      const target = e.target as HTMLElement;
      if (target.closest('[data-comment-marker]')) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      onAddComment(x, y);
    },
    [isFeedbackMode, onAddComment]
  );

  const handleStartEdit = (comment: ImageComment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  const handleSave = (id: string) => {
    if (editingText.trim()) {
      onSaveComment(id, editingText.trim());
    }
    setEditingCommentId(null);
    setEditingText("");
  };

  const handleCancel = () => {
    setEditingCommentId(null);
    setEditingText("");
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${isFeedbackMode ? "cursor-pointer" : ""}`}
      onClick={handleImageClick}
      style={
        isFeedbackMode
          ? {
              cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 24 24' fill='%23ef4444' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'/%3E%3C/svg%3E") 0 30, pointer`,
            }
          : undefined
      }
    >
      {/* Image */}
      <div className="relative w-full">
        <Image
          src={imageUrl}
          alt={alt}
          width={800}
          height={1200}
          className="w-full h-auto select-none"
          unoptimized
        />
      </div>

      {/* Comment Markers */}
      {comments.map((comment) => {
        const isEditing = editingCommentId === comment.id;
        const hasText = comment.text.length > 0;

        return (
          <div
            key={comment.id}
            className="absolute z-10"
            style={{
              left: `${comment.x}%`,
              top: `${comment.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            data-comment-marker
          >
            {/* Marker Pin */}
            <div
              className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-2xl transition-all ${
                hasText
                  ? "bg-gradient-to-br from-orange-500 to-pink-500 hover:scale-110"
                  : "bg-gradient-to-br from-red-500 to-red-600 animate-pulse"
              } ${isFeedbackMode ? "cursor-pointer" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!hasText || isFeedbackMode) {
                  handleStartEdit(comment);
                }
              }}
            >
              {hasText ? comment.number : <MessageSquare className="h-4 w-4" />}
            </div>

            {/* Input Popover */}
            {isEditing && (
              <div
                className="absolute left-10 top-0 z-20 w-72 animate-in fade-in slide-in-from-left-2 duration-200"
                onClick={(e) => e.stopPropagation()}
                style={{ cursor: "default" }}
              >
                <div className="rounded-xl border border-white/20 bg-slate-900/95 p-4 shadow-2xl backdrop-blur-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-semibold text-cyan-400">
                      Feedback #{comment.number}
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        onDeleteComment(comment.id);
                        handleCancel();
                      }}
                      className="h-6 w-6 text-white/50 hover:text-red-400"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    placeholder="What needs to be fixed here?"
                    className="mb-3 min-h-[80px] resize-none rounded-lg border-white/20 bg-slate-800/50 text-sm text-white placeholder:text-white/40 focus-visible:ring-cyan-500/50"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.metaKey) {
                        handleSave(comment.id);
                      } else if (e.key === "Escape") {
                        handleCancel();
                      }
                    }}
                  />

                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancel}
                      className="text-white/70 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSave(comment.id)}
                      disabled={!editingText.trim()}
                      className="rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30"
                    >
                      Save
                    </Button>
                  </div>

                  <p className="mt-2 text-xs text-white/40">
                    Cmd+Enter to save • Esc to cancel
                  </p>
                </div>
              </div>
            )}

            {/* Comment Text Preview (when not editing) */}
            {!isEditing && hasText && (
              <div
                className="absolute left-10 top-0 max-w-xs rounded-lg border border-white/20 bg-slate-900/80 px-3 py-2 text-xs text-white/90 shadow-lg backdrop-blur-sm opacity-0 transition-opacity hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                {comment.text}
              </div>
            )}
          </div>
        );
      })}

      {/* Feedback Mode Hint */}
      {isFeedbackMode && comments.length === 0 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-xl border border-red-500/60 bg-black/60 px-4 py-2.5 backdrop-blur-xl shadow-2xl shadow-black/50 ring-1 ring-red-400/30">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-red-400 animate-pulse drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
              <p className="text-sm font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                Click anywhere on the image to add feedback
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

