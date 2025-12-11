import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const steps = [
  {
    icon: "link2" as const,
    title: "Lägg till oss som hanterare",
    description:
      "Du ger oss tillgång till din Google-företagsprofil. Tar 2 minuter. Vi kan endast svara på recensioner och du kan ta bort oss närsomhelst.",
  },
  {
    icon: "messages" as const,
    title: "Berätta hur du vill låta",
    description:
      "Vill du låta formell eller avslappnad? Du bestämmer helt tonen själv och om du har några speciella önskemål.",
  },
  {
    icon: "star" as const,
    title: "Vi sköter resten",
    description:
      "Alla recensioner besvaras inom 24 timmar. Vi skickar en uppdatering månadsvis och hör av oss om vi märker något viktigt.",
  },
];

export default function HowItWorks() {
  return (
    <section>
      <div className="pb-6 pt-28">
        <MaxWidthWrapper>
          <div>
            <h2 className="font-heading text-2xl text-foreground md:text-4xl lg:text-[40px]">
              Hur fungerar det?
            </h2>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = Icons[step.icon];
              return (
                <div
                  className="rounded-2xl border bg-background p-8"
                  key={step.title}
                >
                  <Icon className="mb-4 h-6 w-auto" />
                  <h3 className="text-lg font-medium">{step.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </MaxWidthWrapper>
      </div>
    </section>
  );
}
