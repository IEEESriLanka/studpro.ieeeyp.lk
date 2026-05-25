export const Overview = () => {
	return (
		<section className="relative bg-background py-32 lg:py-40 overflow-hidden">
			{/* Section signature — sideways year stamp */}
			<div className="pointer-events-none absolute top-32 right-6 lg:right-12 hidden md:block">
				<span
					className="text-[10px] tracking-[0.5em] uppercase text-muted-foreground/60 [writing-mode:vertical-rl] rotate-180 inline-block"
					style={{ fontFeatureSettings: '"tnum"' }}
				>
					— Est. 2017
				</span>
			</div>

			<div className="max-w-[1200px] mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-12 gap-6 lg:gap-12 items-start">
					{/* Left rail — section signature + decorative rule */}
					<div className="col-span-12 lg:col-span-3 flex lg:flex-col items-center lg:items-start gap-6 lg:gap-10">
						<span
							className="font-display text-[var(--primary)] leading-none"
							style={{
								fontSize: "clamp(3rem, 6vw, 5rem)",
								letterSpacing: "0.05em",
							}}
						>
							01
						</span>
						<div className="hidden lg:block">
							<div className="h-px w-24 bg-foreground/20 rotate-[-12deg] origin-left" />
							<div className="mt-8 text-[10px] uppercase tracking-[0.32em] text-muted-foreground/70">
								Section
								<br />
								Signature
							</div>
						</div>
						<div className="lg:hidden h-px flex-1 bg-foreground/20" />
					</div>

					{/* Right — editorial pull quote */}
					<div className="col-span-12 lg:col-span-9 lg:pl-6">
						<span className="eyebrow">About the program</span>

						<blockquote
							className="mt-10 max-w-[24ch] text-foreground"
							style={{
								fontSize: "clamp(2rem, 4.6vw, 4rem)",
								lineHeight: 1.05,
								letterSpacing: "-0.01em",
							}}
						>
							<span
								className="font-display block"
								style={{ letterSpacing: "0.01em" }}
							>
								StudPro is a
							</span>
							<em className="font-serif-italic text-[var(--primary)] block mt-1">
								career guidance
							</em>
							<span
								className="font-display block mt-1"
								style={{ letterSpacing: "0.01em" }}
							>
								initiative — built
							</span>
							<span
								className="font-display block mt-1"
								style={{ letterSpacing: "0.01em" }}
							>
								to{" "}
								<em className="font-serif-italic text-foreground/90">shape</em>{" "}
								careers.
							</span>
						</blockquote>

						<div className="mt-12 grid grid-cols-12 gap-6 items-start">
							<div className="col-span-12 md:col-span-1 hidden md:block pt-2">
								<div className="h-px w-full bg-[var(--primary)]" />
							</div>
							<p className="col-span-12 md:col-span-8 text-foreground/75 text-base lg:text-lg leading-[1.75] max-w-[58ch]">
								Founded by the IEEE Young Professionals Sri Lanka Section in
								2017, StudPro is a platform for IEEE student members and young
								undergraduates to expose their talent to industry — and to carry
								their IEEE membership forward as Young Professionals.
							</p>
						</div>

						<div className="mt-14 flex items-center gap-6">
							<div className="h-px w-12 bg-foreground/30" />
							<p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
								IEEE Young Professionals · Sri Lanka
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
