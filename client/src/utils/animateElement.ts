const animateElement = (element: HTMLElement, keyframes: Keyframe[], options: KeyframeAnimationOptions) => {
	return element.animate(keyframes, {
		duration: 200,
		easing: "cubic-bezier(0.16, 1, 0.3, 1)",
		fill: "both",
		...options,
	});
};

export { animateElement };
