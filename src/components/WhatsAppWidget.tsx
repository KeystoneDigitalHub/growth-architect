import { MessageCircle } from "lucide-react";
import { useState } from "react";

const WhatsAppWidget = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://wa.me/923132147653"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <span className="bg-card border border-border text-foreground text-xs px-3 py-1.5 rounded-lg shadow-lg animate-fade-in whitespace-nowrap">
          Need Help?
        </span>
      )}
      <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
        <MessageCircle size={28} className="text-white" />
      </div>
    </a>
  );
};

export default WhatsAppWidget;
