"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { logoutAction, verifyAuthAction } from "@/app/actions/auth-action";
import { LogOut, User, Mail, Languages, Image, Palette, Download, Keyboard, Info } from "lucide-react";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      // Fetch user info when dialog opens
      verifyAuthAction().then((result) => {
        if (result.authenticated && result.user) {
          setUser(result.user);
        }
      });
    }
  }, [open]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const result = await logoutAction();
      if (result.success) {
        toast.success("Logged out successfully");
        onOpenChange(false);
        router.push("/sign-in");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to logout");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Failed to logout");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border border-white/20 bg-slate-950/95 backdrop-blur-xl shadow-2xl shadow-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Settings
          </DialogTitle>
          <DialogDescription className="text-cyan-200/70">
            Manage your account and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          {user && (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Future Settings Items */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">
              Preferences
            </h3>
            
            <div className="space-y-1">
              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Languages className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Language Settings</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>

              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Image className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Quality Settings</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>

              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Palette className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Theme Settings</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>

              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Download className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Export Settings</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>

              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Keyboard className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Keyboard Shortcuts</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>

              <Button
                disabled
                variant="ghost"
                className="w-full justify-start gap-3 rounded-lg border border-white/10 bg-white/5 p-3 text-left text-white/50 transition-all disabled:cursor-not-allowed hover:bg-white/5"
              >
                <Info className="h-5 w-5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">About</p>
                  <p className="text-xs text-white/40">Coming soon</p>
                </div>
              </Button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t border-white/10">
            <Button
              onClick={handleLogout}
              disabled={isLoading}
              className="w-full gap-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 py-6 font-semibold text-white shadow-lg shadow-red-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-red-500/60 disabled:opacity-50"
            >
              <LogOut className="h-5 w-5" />
              {isLoading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

