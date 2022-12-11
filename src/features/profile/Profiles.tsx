import React, { useState } from "react";
import { localeOption } from "primereact/api";
import { useAppSelector } from "../../hooks/store";
import { api, User } from "../../app/services";
import { selectStorageGroupId } from "../app/appSlice";

import { Badge } from "primereact/badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "../prime/InputText";
import { ProfileButton } from "./ProfileButton";
import { DateText } from "../commons/DateTime";

export function Profiles() {
    const [filterValue, setFilterValue] = useState<string>("");

    const groupId = useAppSelector(selectStorageGroupId);
    const { data: users, isFetching: isUsersFetching } = api.useGetUsersQuery(groupId!, { skip: !groupId });

    const t = localeOption("profile");

    const headerTemplate = (
        <div className="flex justify-content-between align-items-center">
            <span className="mx-1">
                <span className="font-bold text-lg mr-2">{t["members"]}</span>
                <i className="pi pi-users p-overlay-badge font-bold text-lg">
                    <Badge value={users?.length} className="p-badge-sm" />
                </i>
            </span>
            <span className="p-input-icon-right w-6">
                <i className="pi pi-search" />
                <InputText
                    value={filterValue}
                    onChange={(e) => {
                        setFilterValue(e.target.value);
                    }}
                    className="w-full"
                />
            </span>
        </div>
    );

    return (
        <div className="p-card border-1 border-d">
            <DataTable
                value={users}
                rows={8}
                dataKey="id"
                loading={isUsersFetching}
                header={headerTemplate}
                filters={{ global: { value: filterValue, matchMode: "contains" } }}
                globalFilterFields={["name"]}
                rowHover
                removableSort
                responsiveLayout="scroll"
                paginator
                alwaysShowPaginator={false}
                tableClassName="w-full"
                className="p-datatable-card"
            >
                <Column
                    header={t["name"]}
                    body={(user: User) => <ProfileButton profile={user} />}
                    sortable
                    sortField="name"
                    headerClassName="border-top-1"
                    style={{ width: "60%" }}
                />
                <Column
                    header={t["birthday"]}
                    body={(user: User) => <DateText date={user.birthday} />}
                    sortable
                    sortField="birthday"
                    headerClassName="border-top-1"
                    style={{ width: "40%" }}
                />
            </DataTable>
        </div>
    );
}
