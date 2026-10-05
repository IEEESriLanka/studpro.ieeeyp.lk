import LenisWrapper from "@/components/layout/LenisWrapper";
import { TabsSwitcher } from "@/components/events/TabsSwitcher";
import { getPublicEvents } from "@/lib/data/events";

export const revalidate = 3600; // 1-hour ISR revalidation

export default async function EventsPage() {
	const allEvents = await getPublicEvents();

	return (
		<div className="min-h-screen bg-background">
			<LenisWrapper>
				<div className="max-w-7xl mx-auto px-4 py-32">
					<TabsSwitcher allEvents={allEvents} />
				</div>
			</LenisWrapper>
		</div>
	);
}
