"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventTimeline } from "@/components/events/EventTimeline";
import { CATEGORY_CONFIGS } from "@/data/events";

interface TabsSwitcherProps {
	allEvents?: any[];
}

export function TabsSwitcher({ allEvents }: TabsSwitcherProps) {
	return (
		<div className="w-full">
			<Tabs defaultValue={CATEGORY_CONFIGS[0]?.id} className="w-full">
				<TabsList className="flex flex-wrap justify-center gap-3 w-full mb-8 bg-transparent h-auto p-0">
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
						<EventTimeline
							selectedCategory={config.id}
							allEvents={allEvents}
						/>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
