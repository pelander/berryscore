import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import ReviewPreview from "@/components/sections/review-preview";

export default function PreviewLanding() {
  return (
    <div className="pb-6 sm:pb-16">
      <MaxWidthWrapper>
        <ReviewPreview />
      </MaxWidthWrapper>
    </div>
  );
}
