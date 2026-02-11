import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Media } from "@shared/schema";
import { Lock, Play, Image as ImageIcon, Download, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VaultCardProps {
  media: Media;
  className?: string;
}

export function VaultCard({ media, className }: VaultCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(media.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = media.title || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Download failed",
        description: "Could not download the file",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      className={cn(
        "group relative overflow-hidden rounded-xl glass-card",
        "aspect-square cursor-pointer transition-all duration-300",
        "hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-20 flex flex-col justify-end p-4">
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleDownload}
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
      
      {/* Media Type Icon Badge */}
      <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 text-white/80">
        {media.type === 'video' ? <Play size={14} fill="currentColor" /> : <ImageIcon size={14} />}
      </div>

      <img 
        src={media.thumbnailUrl || media.url} 
        alt={media.title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      <div className="absolute bottom-0 left-0 right-0 p-4 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-medium truncate font-display text-lg">{media.title}</h3>
        <p className="text-white/60 text-xs mt-1 font-mono flex items-center gap-1">
          <Lock size={10} /> ENCRYPTED
        </p>
      </div>
    </motion.div>
  );
}
