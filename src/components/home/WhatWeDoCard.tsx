import { ArrowUpRight } from "lucide-react";

export interface WhatWeDoItem {
	title: string;
	description: string;
	image: string;
	index?: number;
}

export const WhatWeDoCard = ({
	title,
	description,
	index = 0,
}: WhatWeDoItem) => {
	const number = String(index + 1).padStart(2, "0");

	return (
		<article className="relative bg-background p-10 lg:p-12 flex flex-col gap-6 group overflow-hidden transition-colors duration-500 hover:bg-[var(--muted)]">
			{/* Top-row: huge index + corner arrow */}
			<div className="flex items-start justify-between">
				<span
					className="font-display leading-none text-foreground/15 group-hover:text-[var(--primary)] transition-all duration-500 group-hover:-translate-y-1 inline-block"
					style={{
						fontSize: "clamp(4rem, 7vw, 6.5rem)",
						letterSpacing: "0.04em",
					}}
				>
					{number}
				</span>

				<span className="opacity-0 group-hover:opacity-100 translate-x-[-6px] translate-y-[6px] group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 ease-out text-[var(--primary)]">
					<ArrowUpRight className="w-5 h-5" strokeWidth={1.5} />
				</span>
			</div>

			{/* Title — large display */}
			<h3
				className="font-display text-foreground leading-[0.95] max-w-[16ch]"
				style={{
					fontSize: "clamp(1.75rem, 2.6vw, 2.5rem)",
					letterSpacing: "0.01em",
				}}
			>
				{title}
			</h3>

			{/* Thin orange rule that grows on hover */}
			<div className="h-px w-8 bg-foreground/20 group-hover:w-16 group-hover:bg-[var(--primary)] transition-all duration-500" />

			<p className="text-muted-foreground leading-[1.7] text-sm max-w-[38ch]">
				{description}
			</p>
		</article>
	);
};
