export type ArticleLayoutProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function ArticleLayout({ title, description, children }: ArticleLayoutProps) {
  return (
    <article className="max-w-350 mx-auto px-6 py-14 sm:py-20">
      <header className="mb-12">
        <h1 className="font-display text-3xl font-semibold text-[#161B22] sm:text-4xl leading-tight">{title}</h1>
        {description && <p className="mt-3 font-body text-sm text-[#161B22]/60 sm:text-base">{description}</p>}
      </header>
      <div className="prose font-body text-sm sm:text-base leading-relaxed text-[#161B22]/80">{children}</div>
    </article>
  );
}
