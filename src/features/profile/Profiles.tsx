import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectStorageGroupId, selectStorageLanguage } from "../app/appSlice";
import { api, User } from "../../app/services";

import { Badge } from "primereact/badge";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "../prime/InputText";
import { ProfileButton } from "./ProfileButton";

export function Profiles() {
    const [filterValue, setFilterValue] = useState<string>("");

    const groupId = useSelector(selectStorageGroupId);
    const language = useSelector(selectStorageLanguage);
    const { data: users, isFetching: isUsersFetching } = api.useGetUsersQuery(groupId!, { skip: !groupId });

    const headerTemplate = (
        <div className="flex justify-content-between align-items-center">
            <span className="mx-1">
                <span className="font-bold text-lg mr-2">Members</span>
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
                    placeholder="Name"
                    className="w-full"
                />
            </span>
        </div>
    );

    const birthdayTemplate = (user: User) =>
        new Date(user.birthday!).toLocaleString(language, {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

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
                className="p-datatable-card"
            >
                <Column
                    header="Name"
                    body={(user: User) => <ProfileButton profile={user} />}
                    sortable
                    sortField="name"
                    headerClassName="border-top-1"
                />
                <Column
                    header="Birthday"
                    body={birthdayTemplate}
                    sortable
                    sortField="birthday"
                    headerClassName="border-top-1"
                />
            </DataTable>
        </div>
    );
}
