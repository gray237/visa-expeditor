export type FAQItem = { question: string; answer: string };

export type FaqSectionProps = {
  heading?: string;
  faqs: FAQItem[];
};

export function FaqSection({ heading, faqs }: FaqSectionProps) {
  return (
    <section className="py-14 sm:py-20 max-w-350 mx-auto px-6">
      {heading && (
        <div className="mb-10">
          <h2 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl">{heading}</h2>
        </div>
      )}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="group border-b border-[#0F2444]/10 pb-4 last:border-0">
            <summary className="flex w-full cursor-pointer list-none items-center justify-between py-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F2444] rounded">
              <h3 className="font-body text-base font-semibold text-[#161B22]">{faq.question}</h3>
              <svg
                className="h-4 w-4 shrink-0 text-[#161B22]/40 transition-transform duration-200 group-open:rotate-180"
                viewBox="0 0 12 12"
                fill="none"
                aria-hidden="true"
              >
                <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M3 4.5 6 7.5 9 4.5" />
              </svg>
            </summary>
            <div className="mt-2 font-body text-sm text-[#161B22]/70 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
    </section>
  );
}
