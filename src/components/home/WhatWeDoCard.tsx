import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export interface WhatWeDoItem {
	title: string;
	description: string;
	image: string;
}

export const WhatWeDoCard = ({ title, description, image }: WhatWeDoItem) => {
	return (
		<Card className="h-full py-4 min-w-[50%] transition-all duration-200 hover:shadow-lg bg-white">
			<CardContent>
				<div className="flex items-start gap-5">
					<div className="flex-1">
						<h3 className="text-3xl font-semibold text-gray-900 mb-2 uppercase">
							{title}
						</h3>
						<p className="text-gray-600 leading-relaxed">{description}</p>
						<div className="w-full h-200px overflow-hidden my-2">
							<Image
								src={image}
								alt={title}
								width={700}
								height={100}
								className="object-cover w-full"
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
