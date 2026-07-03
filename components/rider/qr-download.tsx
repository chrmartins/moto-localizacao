"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QrDownload({ dataUrl, filename }: { dataUrl: string; filename: string }) {
  function download() {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  return (
    <Button onClick={download} size="lg" className="w-full">
      <Download className="size-4" />
      Baixar QR Code (PNG)
    </Button>
  );
}
