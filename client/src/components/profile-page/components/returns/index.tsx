import { Button } from "../../../ui/button";
import { Select } from "../../../ui/select";
import { returns_page_icons } from "./constants/icons";

export function Returns() {
    return (
        <section className="h-screen">
            <h1 className="font-bold text-[28px]">
                Returns
            </h1>
            <p className="text-[#7e859b] text-[1rem]">
                View your returns history or file a new return
            </p>
            <div className="w-full flex items-center justify-end">
                <Select options={[
                    { label: "Last 3 months", value: "last_3_months" },
                    { label: "Last 6 months", value: "last_6_months" }
                ]} className="min-h-[48px] bg-white rounded-[4px] text-[16px] px-6" />
            </div>

            <div className="flex flex-col items-center justify-center h-full">
                {returns_page_icons.noReturnsRequestIcon}

                <div className="flex flex-col items-center space-y-3">
                    <div>
                        <h3 className="text-[19px] font-bold text-center">
                            No returns requested
                        </h3>
                        <p>
                            You have not requested any previous returns
                        </p>
                    </div>

                    <Button>
                        Create a new return
                    </Button>
                </div>
            </div>
        </section>
    )
}
