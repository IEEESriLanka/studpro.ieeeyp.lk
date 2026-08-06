"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventTimeline } from "@/components/events/EventTimeline";
import { CATEGORY_CONFIGS } from "@/data/events";

/**
 * Renders the main events page with category-based tabs.
 * Each tab corresponds to an entry in CATEGORY_CONFIGS (Career Fairs,
 * CV Clinics, Industry Visits, etc.) and displays events grouped
 * under that category using EventTimeline.
 *
 * Tabs are rendered as tile buttons in a flex-wrap layout so they
 * naturally wrap to the next line when there are too many to fit on one row.
 * The active tab is highlighted with the primary accent color.
 *
 * To add a new category tab, add a new EventCategory to CATEGORY_CONFIGS
 * in src/data/events.ts — no changes needed here.
 */
export function TabsSwitcher() {
	return (
		<div className="w-full">
			<Tabs
				defaultValue={CATEGORY_CONFIGS[0]?.id}
				className="w-full"
			>
				{/*
				 * Flex-wrap tile container for category tabs.
				 * gap-3 provides spacing between tiles; justify-center centers them.
				 * On narrow screens tiles stack neatly; on wide screens they spread out.
				 */}
				<TabsList
					className="flex flex-wrap justify-center gap-3 w-full mb-8 bg-transparent h-auto p-0"
				>
					{CATEGORY_CONFIGS.map((config) => (
						<TabsTrigger
							key={config.id}
							value={config.id}
							className="px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap
								bg-white border-2 border-primary/20 text-secondary
								hover:border-primary/50 hover:bg-primary/5 hover:text-primary
								data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary
								transition-all duration-200 shadow-sm data-[state=active]:shadow-md"
						>
							{config.label}
						</TabsTrigger>
					))}
				</TabsList>

				{CATEGORY_CONFIGS.map((config) => (
					<TabsContent key={config.id} value={config.id} className="mt-0">
						<EventTimeline selectedCategory={config.id} />
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
