import Link from "next/link";

const footerLinks = {
  Projects: [
    { href: "/projects/01-abnormal-results", label: "Abnormal Result Predictor" },
    { href: "/projects/02-turnaround-time", label: "Turnaround Time Predictor" },
    { href: "/projects/03-patient-segmentation", label: "Patient Segmentation" },
    { href: "/projects/04-test-bundles", label: "Test Bundle Analysis" },
    { href: "/projects/05-revenue-anomalies", label: "Revenue Anomaly Detection" },
  ],
  "More Projects": [
    { href: "/projects/06-ticket-intelligence", label: "Ticket Intelligence" },
    { href: "/projects/07-soap-nlp", label: "SOAP Notes NLP" },
    { href: "/projects/08-radiology-parser", label: "Radiology Parser" },
    { href: "/projects/09-cross-client-benchmark", label: "Cross-Client Benchmarking" },
  ],
  Site: [
    { href: "/methodology", label: "Methodology" },
    { href: "/about", label: "About" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#1A1F35] text-white">
      <div className="max-w-[1200px] mx-auto px-8 md:px-12 lg:px-16 py-16">

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              {/* Text logo for dark background — swap to white SVG later */}
              <span className="text-white font-bold text-lg tracking-tight">
                Dashlabs.ai
              </span>
            </div>
            <p className="text-sm text-[#8B95B8] leading-relaxed max-w-[220px]">
              A healthcare data science portfolio built on anonymized diagnostic
              lab data. Not an official Dashlabs product.
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#27AE60]" />
              <span className="text-xs text-[#8B95B8] font-mono">
                All data anonymized
              </span>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-[#8B95B8] uppercase tracking-widest mb-4 font-mono">
                {category}
              </p>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="
                        text-sm text-[#D7DCEE] hover:text-white
                        transition-colors duration-150 cursor-pointer
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom rule */}
        <div className="border-t border-[#475175]/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8B95B8] font-mono">
            © {new Date().getFullYear()} Dashlabs.ai Data Science Team
          </p>
          <p className="text-xs text-[#8B95B8]">
            Built with Next.js · Deployed on Vercel
          </p>
        </div>
      </div>
    </footer>
  );
}
