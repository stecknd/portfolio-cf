const scrollToSection  = (scrollContainer: HTMLElement, section: number) => {
    scrollContainer.scrollTo({
        top: section * scrollContainer.clientHeight,
        behavior: 'smooth'
    });
}

export const scrollToNextSection = (
	scrollContainer: HTMLElement,
	currentSection: number
) => {
	scrollToSection(scrollContainer, currentSection + 1);
}



export const setupScrollSnapping = (
	scrollContainer: HTMLElement,
	setCurrentSection: (section: number) => void
) => {
	let scrollTimeout: ReturnType<typeof setTimeout>;

	const onScroll = () => {
		clearTimeout(scrollTimeout);

		const scrollTop = scrollContainer.scrollTop;
		const containerHeight = scrollContainer.clientHeight;
		const section = Math.round(scrollTop / containerHeight);
		setCurrentSection(section);

		scrollTimeout = setTimeout(() => {
			scrollToSection(scrollContainer, section);
		}, 100);
	};

	scrollContainer.addEventListener('scroll', onScroll);
}
