import Image from "next/image";
import Link from "next/link";

import { env } from "@/env.mjs";
import { Icons } from "@/components/shared/icons";

export default async function HeroLanding() {
  const { stargazers_count: stars } = await fetch(
    "https://api.github.com/repos/mickasmt/next-saas-stripe-starter",
    {
      ...(env.GITHUB_OAUTH_TOKEN && {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_OAUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
      }),
      // data will revalidate every hour
      next: { revalidate: 3600 },
    },
  )
    .then((res) => res.json())
    .catch((e) => console.log(e));

  return (
    <section className="space-y-6 pb-12 pt-16 sm:pb-20 sm:pt-24 lg:pb-20 lg:pt-24">
      <div className="container flex max-w-5xl flex-col items-center gap-5 text-center">

        <Image
          src="/illustrations/handstars.svg"
          alt=""
          width={98}
          height={98}
          className="mx-auto mb-8"
        />

        <h1 className="text-balance font-urban text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[66px]">
          Vi hanterar dina recensioner.{" "}
          <span className="text-gradient_indigo-purple font-extrabold">
            
          </span>
        </h1>

        <p
          className="max-w-2xl text-balance pt-2 font-normal leading-normal text-[#474747] sm:text-[22px] sm:leading-7"
          style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
        >
          Professionella svar på alla dina Google-recensioner inom 24h. Vi kan även be nöjda kunder lämna nya.
        </p>

        <div
          className="mt-8 flex justify-center space-x-2 md:space-x-4"
          style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
        >
          <Link
            href="/pricing"
            prefetch={true}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-[15px] font-medium text-white transition-colors hover:bg-blue-700"
          >
            <span>Kom igång – 995 kr/mån</span>
            <Icons.arrowRight className="size-4" />
          </Link>
          {/* <Link
            href={siteConfig.links.github}
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                rounded: "full",
              }),
              "px-5",
            )}
          >
            <Icons.gitHub className="mr-2 size-4" />
            <p>
              <span className="hidden sm:inline-block">Star on</span> GitHub{" "}
              <span className="font-semibold">{nFormatter(stars)}</span>
            </p>
          </Link> */}
        </div>

        <p className="-mt-3 text-[13px] font-normal text-[#45433e]">
          Allt ingår. Ingen bindningstid.
        </p>
      </div>
    </section>
  );
}
