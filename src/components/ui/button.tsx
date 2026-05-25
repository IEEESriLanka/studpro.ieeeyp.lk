import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium tracking-tight transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				primary: "bg-foreground text-background hover:bg-foreground/90",
				accent: "bg-primary text-primary-foreground hover:bg-primary/90",
				outline:
					"border border-border bg-transparent text-foreground hover:border-foreground/40",
				ghost:
					"bg-transparent text-foreground hover:text-primary [&:hover_.btn-underline]:scale-x-100",
				link: "text-foreground underline-offset-4 hover:text-primary hover:underline px-0 h-auto",
			},
			size: {
				default: "h-11 px-6",
				sm: "h-9 px-4 text-xs",
				lg: "h-12 px-8 text-base",
				icon: "size-10",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };
