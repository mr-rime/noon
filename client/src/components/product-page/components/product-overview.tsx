import { Separator } from "../../ui/separator"
import { SpecificationsTable } from "../../ui/specifications-table";

export function ProductOverview() {
    return (
        <section aria-labelledby="product-overview-heading">
            <header>
                <h1 id="product-overview-heading" className="font-bold text-[24px]">Product Overview</h1>
            </header>
            <Separator className="my-5" />
            <section className="flex items-start justify-center gap-[72px]">
                <section className="w-1/2">
                    <section aria-labelledby="highlights-heading">
                        <h2 id="highlights-heading" className="font-bold text-[16px] mb-4">Highlights</h2>
                        <ul className="list-disc pl-5 space-y-2 w-full text-justify ">
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Personalise your home screen. Tint your icons with any colour. Rearrange and resize apps and widgets. You can even lock or hide apps to protect sensitive information — it's your call.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Choose your controls. Swap out your lock screen controls for ones you love to use more often. Or you can assign a control to the action button.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    In the redesigned Photos app, your Collections are automatically organised by topic, like people and pets.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">
                                    Personalise every style even more with the new control pad, which makes it easy to adjust tone and colour simultaneously. You can also use the slider to adjust the intensity of specific colours instead of applying a one-size-fits-all approach.
                                </span>
                            </li>
                            <li className="w-full">
                                <span className="text-[14px]">Our improved image pipeline also enables more creative styles, which allow you to customise the different moods of a photo through colour.</span>
                            </li>
                        </ul>
                    </section>

                    <section aria-labelledby="overview-heading" className="mt-7">
                        <h2 id="overview-heading" className="font-bold text-[16px] mb-4">Overview</h2>
                        <p className="text-[14px] text-justify">
                            Apple Intelligence protects your privacy at every step. With on-device processing and Private Cloud Compute, no one but you can access your data — not even Apple. The new Passwords app makes it even easier to access account passwords, passkeys, Wi-Fi passwords, two-factor authentication codes and more. It stores them securely and syncs across your devices with end-to-end encryption. You can also control which contacts to share with an app, rather than giving it access to all your contacts. And you can choose to share more contacts over time.
                        </p>
                    </section>
                </section>

                <section className="w-1/2">
                    <h2 id="specifications-heading" className="font-bold text-[16px] mb-4">Specifications</h2>
                    <SpecificationsTable />
                </section>
            </section>
        </section>
    );
}
