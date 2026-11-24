import { CLIENT_REVIEWS } from "../../data/reviews";
import { Container, SectionHeader } from "../ui";

export function ReviewsSection() {
  return (
    <section
      id="reviews"
      className="scroll-mt-24 border-b border-hairline bg-plaster py-20 md:py-28"
    >
      <Container className="space-y-10 md:space-y-12">
        <SectionHeader
          title="Built on Repeat Visits."
          subtitle="Consistent silhouette grow-out, punctual chairs, and zero waiting-room friction."
        />

        <div className="grid grid-cols-1 divide-y divide-hairline border-y border-hairline md:grid-cols-3 md:divide-x md:divide-y-0">
          {CLIENT_REVIEWS.map((review) => (
            <blockquote
              key={review.id}
              className="flex flex-col justify-between gap-8 py-8 md:px-8 first:md:pl-0 last:md:pr-0"
            >
              <div className="space-y-4">
                <span
                  aria-hidden="true"
                  className="block font-serif text-4xl leading-none text-cypress select-none"
                >
                  &ldquo;
                </span>

                <p className="font-serif text-[1.1875rem] leading-[1.55] tracking-[-0.005em] text-ink text-pretty">
                  {review.quote}
                </p>
              </div>

              <footer className="space-y-2 border-t border-hairline pt-5">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {review.author}
                  </p>
                  <p className="text-xs text-ink-secondary">
                    {review.role}, {review.neighborhood}
                  </p>
                </div>
                <p className="font-mono text-[11px] tracking-[0.06em] text-cypress">
                  {review.serviceName}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </section>
  );
}
