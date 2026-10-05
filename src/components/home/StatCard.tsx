import { StatsData } from "@/components/home/Stats";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as Ri from "react-icons/ri";
import * as Fa from "react-icons/fa";
import * as Md from "react-icons/md";
import * as Bs from "react-icons/bs";
import { IconType } from "react-icons";

interface StatCardProps {
	stat: StatsData;
	cardStyle?: string;
	textStyle?: string;
}

export const StatCard = ({ stat, cardStyle, textStyle }: StatCardProps) => {
	// Map from lucide icon names to react-icons
	const iconMap: Record<string, IconType> = {
		GraduationCap: Fa.FaGraduationCap,
		Users: Fa.FaUsers,
		LayoutTemplate: Ri.RiLayoutGridLine,
		MicVocal: Fa.FaMicrophone,
		Badge: Bs.BsAward, // Default fallback
	};

	return (
		<Card
			className={cn(
				"flex flex-row w-64 p-8 border-2 border-white shadow-2xl",
				cardStyle,
			)}
		>
			<div className="flec items-center justify-center">
				{stat.icon &&
					(() => {
						const Icon = iconMap[stat.icon] || Bs.BsAward;
						return <Icon className={cn("w-12 h-12", textStyle)} />;
					})()}
			</div>
			<div className="flex flex-col">
				<h3 className={cn("text-2xl font-bold", textStyle)}>{stat.value}+</h3>
				<p className={cn("text-md font-semibold uppercase", textStyle)}>
					{stat.type}
				</p>
			</div>
		</Card>
	);
};
