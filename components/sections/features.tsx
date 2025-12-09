import Image from "next/image";

import { featureStats } from "@/config/landing";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export default function Features() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <div>
            <h2 className="font-heading text-2xl text-foreground md:text-4xl lg:text-[40px]">
              Varför svara på recensioner?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              I dag läser nästan alla recensioner innan de väljer ett företag.
              Så här påverkar det dig.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4">
            {/* Top row - 2 cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              {featureStats.slice(0, 2).map((stat, index) => (
                <div
                  className="rounded-2xl border bg-background p-8"
                  key={stat.title}
                >
                  <Image
                    src={`/illustrations/hand${index + 1}.svg`}
                    alt=""
                    width={28}
                    height={28}
                    className="mb-4 h-12 w-auto"
                  />
                  <h3 className="text-lg font-medium">{stat.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom row - 3 cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featureStats.slice(2).map((stat, index) => (
                <div
                  className="rounded-2xl border bg-background p-8"
                  key={stat.title}
                >
                  <Image
                    src={`/illustrations/hand${index + 3}.svg`}
                    alt=""
                    width={28}
                    height={28}
                    className="mb-4 h-12 w-auto"
                  />
                  <h3 className="text-lg font-medium">{stat.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
