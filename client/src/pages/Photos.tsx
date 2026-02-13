import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useMedia, useCreateMedia } from "@/hooks/use-media";
import { VaultCard } from "@/components/VaultCard";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Image as ImageIcon, Loader2, Trash2, CheckSquare, Square } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMediaSchema, type InsertMedia } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Photos() {
  const { data: mediaItems, isLoading } = useMedia();
  const createMedia = useCreateMedia();
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSelectMode, setIsSelectMode] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteManyMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      await apiRequest("POST", "/api/media/delete-many", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setSelectedIds([]);
      setIsSelectMode(false);
      toast({
        title: "Deleted",
        description: "Selected items removed from vault",
      });
    },
  });

  const form = useForm<InsertMedia>({
    resolver: zodResolver(insertMediaSchema),
    defaultValues: {
      type: "photo",
      title: "",
      url: "",
      thumbnailUrl: "",
    },
  });

  const onSubmit = (data: InsertMedia) => {
    createMedia.mutate({ ...data, type: "photo" }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Mocking file upload
      const url = URL.createObjectURL(file);
      createMedia.mutate({
        type: "photo",
        title: file.name,
        url: url,
        thumbnailUrl: url,
      });
    }
    setOpen(false);
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const photos = mediaItems?.filter(item => item.type === "photo") || [];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Photo Gallery</h1>
          <p className="text-muted-foreground">Your secured encrypted memories</p>
        </div>

        <div className="flex items-center gap-3">
          {photos.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSelectMode(!isSelectMode);
                setSelectedIds([]);
              }}
              className={cn(
                "border-white/10 hover:bg-white/5",
                isSelectMode && "bg-primary/20 border-primary/50 text-primary hover:bg-primary/30"
              )}
            >
              {isSelectMode ? "Cancel Selection" : "Select Items"}
            </Button>
          )}

          <AnimatePresence>
            {isSelectMode && selectedIds.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Button 
                  variant="destructive" 
                  onClick={() => deleteManyMutation.mutate(selectedIds)}
                  disabled={deleteManyMutation.isPending}
                  className="gap-2"
                >
                  {deleteManyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 size={18} />}
                  <span>Delete ({selectedIds.length})</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isSelectMode && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
                  <Plus size={18} />
                  <span>Add Photos</span>
                </button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Add Secure Photos</DialogTitle>
                  <DialogDescription className="text-muted-foreground">
                    Upload multiple photos to your encrypted vault.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div className="p-8 border-2 border-dashed border-white/10 rounded-xl hover:border-primary/50 transition-colors group cursor-pointer relative">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-primary/20 transition-colors">
                        <Plus className="w-8 h-8 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <p className="text-sm font-medium text-white">Click to upload multiple files</p>
                      <p className="text-xs text-muted-foreground mt-1">Unlimited photo storage enabled</p>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square rounded-xl bg-card/50 animate-pulse border border-white/5" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-2xl bg-card/20">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <ImageIcon className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-white mb-1">No photos yet</h3>
          <p className="text-muted-foreground max-w-sm mb-6">Your vault is empty. Add your first secure photo to get started.</p>
          <Button onClick={() => setOpen(true)} variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
            Add First Photo
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <VaultCard media={photo} />
              {isSelectMode && (
                <div 
                  className="absolute inset-0 z-30 flex items-start justify-start p-3 cursor-pointer bg-black/20 rounded-xl transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(photo.id);
                  }}
                >
                  <div className={cn(
                    "p-1 rounded bg-black/60 border border-white/20 text-white",
                    selectedIds.includes(photo.id) && "bg-primary border-primary"
                  )}>
                    {selectedIds.includes(photo.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
