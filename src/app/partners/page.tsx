import LenisWrapper from "@/components/layout/LenisWrapper";
import { PartnerTabsSwitcher } from "@/components/partners/PartnerTabsSwitcher";
import { getPublicPartnersGroupedByYear } from "@/lib/data/partners";

export const revalidate = 3600; // 1-hour ISR revalidation

export default async function PartnersPage() {
	const partnersByYear = await getPublicPartnersGroupedByYear();

	return (
		<div className="min-h-screen bg-background">
			<LenisWrapper>
				<div className="max-w-6xl mx-auto px-4 py-32">
					<PartnerTabsSwitcher partnersByYear={partnersByYear} />
				</div>
			</LenisWrapper>
		</div>
	);
}
