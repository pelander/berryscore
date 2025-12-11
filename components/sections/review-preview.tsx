export default function ReviewPreview() {
  return (
    <div className="relative mx-auto w-full max-w-lg px-4 py-8 md:px-0">
      {/* Main Card */}
      <div className="rounded-2xl border bg-white p-6 shadow-lg">
        {/* Review Header */}
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-purple-600 font-semibold text-white">
            AS
          </div>
          <div>
            <p className="font-semibold">Anna Svensson</p>
            <p className="text-sm text-muted-foreground">För 2 timmar sedan</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="mt-4 text-foreground">
          &quot;Maten var fantastisk men vi fick vänta nästan 40 minuter på
          huvudrätten. Lite synd för annars var allt perfekt.&quot;
        </p>

        {/* Divider */}
        <div className="my-4 border-t" />

        {/* AI Response Section */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-orange-500">
            ✨ Professionellt svar från dig. (skrivet av oss)
          </span>
          <div className="mt-2 rounded border-l-4 border-orange-400 bg-orange-50 p-4">
            <p className="text-m text-foreground">
              Tack Anna för din feedback! Vi är glada att maten föll dig i
              smaken. Du har helt rätt – 40 minuter är för lång väntetid. Hoppas
              du ger oss en ny chans – hör av dig så bjuder vi på ett glas
              bubbel! /Marcus
            </p>
          </div>
        </div>
      </div>

      {/* Floating Stat Card: Top Right (+340%) */}
      <div className="absolute -right-2 -top-2 animate-float rounded-xl border bg-white p-3 shadow-md md:-right-12 md:-top-4 md:p-4">
        <p className="text-2xl font-bold text-green-700 md:text-3xl">+340%</p>
        <p className="text-xs text-muted-foreground md:text-sm">
          Fler recensioner
        </p>
      </div>

      {/* Floating Stat Card: Bottom Left (100%) */}
      <div className="absolute -bottom-2 -left-2 animate-float-slow rounded-xl border bg-white p-3 shadow-md md:-bottom-4 md:-left-12 md:p-4">
        <p className="text-2xl font-bold text-green-700 md:text-3xl">100%</p>
        <p className="text-xs text-muted-foreground md:text-sm">
          Svar på recensioner
        </p>
      </div>
    </div>
  );
}
