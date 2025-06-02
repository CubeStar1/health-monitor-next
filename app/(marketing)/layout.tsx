import { Header } from "@/components/global/header";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<Header />
			{children}
		</>
	);
}