import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectStorageGroupId } from "../app/appSlice";
import { useGetRemindersQuery, Prostava } from "../../app/services";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Badge } from "primereact/badge";
import { InputText } from "../prime/InputText";
import { DateText } from "../commons/DateTime";
import { ProfileButton } from "../profile/ProfileButton";
import { ProstavaNameChip } from "./ProstavaNameChip";

export function Reminders() {
    const [filterValue, setFilterValue] = useState<string>("");

    const groupId = useSelector(selectStorageGroupId);

    const { data: reminders, isFetching: isRemindersFetching } = useGetRemindersQuery(groupId!);

    const headerTemplate = (
        <div className="flex justify-content-between align-items-center">
            <span className="mx-1">
                <span className="font-bold text-lg mr-2">Reminders</span>
                <i className="pi pi-bell p-overlay-badge font-bold text-lg">
                    <Badge value={reminders?.length} className="p-badge-sm" severity="danger" />
                </i>
            </span>
            <span className="p-input-icon-right w-6">
                <i className="pi pi-search" />
                <InputText
                    value={filterValue}
                    onChange={(e) => {
                        setFilterValue(e.target.value);
                    }}
                    placeholder="Name or author"
                    className="w-full"
                />
            </span>
        </div>
    );

    return (
        <div className="p-card border-1 border-d">
            <DataTable
                value={reminders}
                rows={5}
                header={headerTemplate}
                loading={isRemindersFetching}
                rowGroupMode="rowspan"
                groupRowsBy="author.name"
                sortField="closing_date"
                sortOrder={-1}
                removableSort
                filters={{ global: { value: filterValue, matchMode: "contains" } }}
                globalFilterFields={["name", "author.name"]}
                breakpoint="575px"
                className="p-datatable-card"
            >
                <Column
                    header="Name"
                    body={(prostava: Prostava) => <ProstavaNameChip prostava={prostava} />}
                    field="name"
                    sortable
                    sortField="name"
                    headerClassName="border-top-1"
                />
                <Column
                    header="Author"
                    body={(prostava: Prostava) => <ProfileButton profile={prostava.author} />}
                    sortable
                    field="author.name"
                    sortField="author.name"
                    headerClassName="border-top-1"
                />
                <Column
                    header="Expires"
                    body={(prostava: Prostava) => <DateText date={prostava.closing_date!} />}
                    sortable
                    sortField="closing_date"
                    headerClassName="border-top-1"
                />
            </DataTable>
        </div>
    );
}
