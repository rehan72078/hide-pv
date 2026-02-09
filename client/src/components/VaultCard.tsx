import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type Media } from "@shared/schema";
import { Lock, Play, Image as ImageIcon } from "lucide-react";

interface VaultCardProps {
  media: Media;
  className?: string;
}

export function VaultCard({ media, className }: VaultCardProps) {
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

      <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-medium truncate font-display text-lg">{media.title}</h3>
        <p className="text-white/60 text-xs mt-1 font-mono flex items-center gap-1">
          <Lock size={10} /> ENCRYPTED
        </p>
      </div>
    </motion.div>
  );
}
