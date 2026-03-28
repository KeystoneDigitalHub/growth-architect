import certAifa from "@/assets/cert-aifa.png";
import certCanva from "@/assets/cert-canva.jpg";
import certCareer from "@/assets/cert-career.png";
import certSmm from "@/assets/cert-smm.jpg";
import certEnglish from "@/assets/cert-english.jpg";
import certVideo from "@/assets/cert-video.jpg";
import certWebdev from "@/assets/cert-webdev.png";
import { ExternalLink } from "lucide-react";

const certs = [
  { src: certAifa, label: "Gen AI Accelerator" },
  { src: certWebdev, label: "Full-Stack Web Engineering" },
  { src: certSmm, label: "Social Media Marketing" },
  { src: certCanva, label: "Canva Freelancing" },
  { src: certVideo, label: "Video Editing" },
  { src: certCareer, label: "Career Readiness" },
  { src: certEnglish, label: "Spoken English" },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding">
      <div className="max-w-7xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Applied Thinking</p>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">
          Certifications & Portfolio
        </h2>
        <p className="text-muted-foreground mb-8 max-w-lg">
          Structure over decoration. Every credential represents applied capability.
        </p>

        <a
          href="https://linktr.ee/Keystone_Digital_Hub"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border border-border text-foreground hover:bg-muted transition-colors mb-10"
        >
          View Full Portfolio <ExternalLink size={14} />
        </a>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {certs.map((c) => (
            <div key={c.label} className="glow-card overflow-hidden group">
              <img
                src={c.src}
                alt={c.label}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="p-3">
                <p className="text-xs font-medium truncate">{c.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
