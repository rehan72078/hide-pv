import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Media } from "@shared/schema";
import { Lock, Play, Image as ImageIcon, Download, Trash2, Loader2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface VaultCardProps {
  media: Media;
  className?: string;
}

export function VaultCard({ media, className }: VaultCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/media/${media.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      toast({
        title: "Deleted",
        description: "Item removed from vault",
      });
    },
  });

  const triggerDownload = () => {
    const link = document.createElement("a");
    link.href = media.url;
    link.download = media.title || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAdModal(true);
  };

  const confirmDownload = () => {
    setShowAdModal(false);
    triggerDownload();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, scale: 1.02 }}
        onClick={() => setShowModal(true)}
        className={cn(
          "group relative overflow-hidden rounded-xl glass-card flex flex-col",
          "cursor-pointer transition-all duration-300",
          "hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50",
          className
        )}
      >
        <div className="aspect-square relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end p-4">
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleDownloadClick}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Download"
              >
                <Download size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate();
                }}
                disabled={deleteMutation.isPending}
                className="p-2 rounded-lg bg-destructive/20 hover:bg-destructive/40 text-destructive-foreground transition-colors"
                title="Delete"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity z-10" />
          
          <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/80">
            {media.type === 'video' ? <Play size={14} fill="currentColor" /> : <ImageIcon size={14} />}
          </div>

          <img 
            src={media.thumbnailUrl || media.url} 
            alt={media.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="p-3 bg-black/40 backdrop-blur-sm border-t border-white/5">
          <h3 className="text-white font-medium truncate font-display text-sm">{media.title}</h3>
          <p className="text-white/40 text-[10px] mt-1 font-mono uppercase tracking-tighter">
            {media.createdAt ? format(new Date(media.createdAt), "MMM d, yyyy • HH:mm") : "ENCRYPTED"}
          </p>
        </div>
      </motion.div>

      {/* Full-screen Media Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <button 
              className="absolute top-6 right-6 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors z-[110]"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="max-w-5xl w-full max-h-[85vh] flex items-center justify-center relative"
              onClick={(e) => e.stopPropagation()}
            >
              {media.type === 'video' ? (
                <video 
                  src={media.url} 
                  controls 
                  autoPlay 
                  className="max-w-full max-h-full rounded-lg shadow-2xl"
                />
              ) : (
                <img 
                  src={media.url} 
                  alt={media.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              )}
              
              <div className="absolute -bottom-16 left-0 right-0 text-center">
                <h2 className="text-2xl font-bold font-display text-white">{media.title}</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  {media.createdAt && format(new Date(media.createdAt), "PPP p")}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AdSense Placeholder Modal */}
      <AnimatePresence>
        {showAdModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-card border border-white/10 rounded-2xl p-8 max-w-md w-full text-center space-y-6"
            >
              <div className="w-full aspect-video bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                <div className="space-y-2">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Sponsored Advertisement</div>
                  <div className="text-xl font-bold text-white/20">Google AdSense</div>
                  <div className="text-xs text-white/10">300 x 250 placeholder</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Preparing Download</h3>
                <p className="text-muted-foreground text-sm">Your secure file is being decrypted and prepared for high-speed download.</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAdModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDownload}
                  className="flex-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-lg shadow-primary/20 text-sm"
                >
                  Start Download
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
