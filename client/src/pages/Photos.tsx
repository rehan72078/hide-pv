import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useMedia, useCreateMedia } from "@/hooks/use-media";
import { VaultCard } from "@/components/VaultCard";
import { motion } from "framer-motion";
import { Plus, Image as ImageIcon, Loader2 } from "lucide-react";
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

export default function Photos() {
  const { data: mediaItems, isLoading } = useMedia();
  const createMedia = useCreateMedia();
  const [open, setOpen] = useState(false);

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
    // Force type to photo
    createMedia.mutate({ ...data, type: "photo" }, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      }
    });
  };

  const photos = mediaItems?.filter(item => item.type === "photo") || [];

  return (
    <Layout>
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white mb-2">Photo Gallery</h1>
          <p className="text-muted-foreground">Your secured encrypted memories</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0">
              <Plus size={18} />
              <span>Add Photo</span>
            </button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Add Secure Photo</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Add a new photo URL to your encrypted vault.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Summer Vacation 2024" className="bg-secondary/50 border-white/10 focus:border-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Photo File</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      accept="image/*" 
                      className="bg-secondary/50 border-white/10 focus:border-primary" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Mocking file selection by using a local object URL
                          // In a real app, you'd upload this to storage
                          form.setValue("url", URL.createObjectURL(file));
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="hover:bg-white/5 hover:text-white">Cancel</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-white" disabled={createMedia.isPending}>
                    {createMedia.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                    Save to Vault
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
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
            <VaultCard key={photo.id} media={photo} />
          ))}
        </div>
      )}
    </Layout>
  );
}
