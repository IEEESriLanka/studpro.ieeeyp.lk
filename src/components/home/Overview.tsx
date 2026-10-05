export const Overview = () => {
	return (
		<div className="h-[70vh] bg-transparent flex justify-center px-4 py-10 md:py-0">
			<div className="flex flex-col md:flex-row justify-center items-center max-w-5xl gap-8 md:gap-16 my-auto">
				<div className="w-full md:flex-1/2 flex flex-col justify-start text-white gap-4 drop-shadow-xl/20">
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-wide text-center md:text-left">
						Introducing StudPro
					</h1>
					<p className="text-center md:text-left text-base sm:text-lg">
						The Ultimate bridge for Undergraduates to Connect with Industry
						Leaders
					</p>
				</div>
				<div className="w-full md:flex-2/3 bg-white p-6 md:p-8 rounded-lg shadow-xl/20 mt-6 md:mt-0">
					<p className="text-sm sm:text-base">
						StudPro is an career guidance initiative founded by Institute of
						Electrical and Electronics Engineers (IEEE) Young Professional Sri
						Lanka Section in 2017 to provide a platform for IEEE student members
						and young undergraduates to expose their talent to the industries as
						well as to encourage the maintenance of their IEEE membership as
						Young Professionals.
					</p>
				</div>
			</div>
		</div>
	);
};
