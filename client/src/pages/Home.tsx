import { Link } from "wouter";
import { motion } from "framer-motion";
import { Camera, Video, Shield, Lock, Fingerprint } from "lucide-react";
import { Layout } from "@/components/Layout";
import { SiGoogle } from "react-icons/si";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-3xl mx-auto">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8 w-full"
        >
          <motion.div variants={item} className="space-y-4">
            <div className="inline-flex items-center justify-center p-3 mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 shadow-[0_0_30px_-5px_rgba(109,40,217,0.3)]">
              <Shield className="w-10 h-10 text-primary" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-display tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 pb-2">
              Secure Photo &<br /> Video Vault
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mx-auto font-light leading-relaxed">
              Military-grade encryption for your most personal memories. 
              Hide your photos and videos securely in our cloud vault.
            </p>
          </motion.div>

          <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mx-auto mt-12">
            <Link href="/photos" className="group">
              <div className="relative h-48 rounded-2xl bg-card border border-white/10 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-primary/20 transition-colors z-10">
                  <Camera className="w-8 h-8 text-white group-hover:text-primary transition-colors" />
                </div>
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 font-display">Photos</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">Access secure gallery</p>
                </div>
              </div>
            </Link>

            <Link href="/videos" className="group">
              <div className="relative h-48 rounded-2xl bg-card border border-white/10 p-8 flex flex-col items-center justify-center gap-4 cursor-pointer overflow-hidden transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="p-4 rounded-full bg-white/5 group-hover:bg-blue-500/20 transition-colors z-10">
                  <Video className="w-8 h-8 text-white group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="text-center z-10">
                  <h3 className="text-2xl font-bold text-white mb-1 font-display">Videos</h3>
                  <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors">Access secure library</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div variants={item} className="pt-12">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono uppercase tracking-widest">
                <span className="w-8 h-[1px] bg-white/10"></span>
                Authentication Required
                <span className="w-8 h-[1px] bg-white/10"></span>
              </div>
              
              <button 
                className="flex items-center gap-3 px-8 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
                onClick={() => alert("This is a demo button")}
              >
                <SiGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
              
              <div className="flex gap-6 mt-4 opacity-50">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Lock size={12} /> SSL Secured
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Fingerprint size={12} /> Biometric Ready
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  );
}
