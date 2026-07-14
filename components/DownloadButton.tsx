"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";
import { formatBytes } from "@/lib/format";

export default function DownloadButton({
  id,
  version,
  sizeBytes,
}: {
  id: number;
  version: string;
  sizeBytes: number;
}) {
  return (
    <motion.a
      href={`/api/download/${id}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-bold text-black shadow-[0_20px_60px_-20px_rgba(255,255,255,0.5)]"
    >
      <Download size={20} strokeWidth={2.4} />
      Download v{version}
      <span className="text-sm font-medium text-black/50">
        {formatBytes(sizeBytes)}
      </span>
    </motion.a>
  );
}
