import { SpecRow } from "./spec-row";

export function SpecificationsTable() {
    return (
        <div className="w-full">
            <table className="table-fixed w-full">
                <tbody>
                    <SpecRow specName="Expandable Memory Type" specValue="No Expandable Memory" />
                    <SpecRow specName="Secondary Camera Resolution" specValue="12 MP" bgColor="#FFF" />
                    <SpecRow specName="Charging Type" specValue="Type-C" bgColor="#EFF3FD" />
                </tbody>
            </table>
        </div>
    )
}
