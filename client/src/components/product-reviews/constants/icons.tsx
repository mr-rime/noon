import { HelpfulIcon, NoonIcon, NoReviewsFoundSVG, VerifiedIcon, YellowStar } from "./components";

export const reviews_icons = {
	noReviewsFound: <NoReviewsFoundSVG />,
	yellowStar: <YellowStar />,
	noonIcon: <NoonIcon />,
	verifiedIcon: <VerifiedIcon />,
	helpfulIcon: <HelpfulIcon />
} as const;
