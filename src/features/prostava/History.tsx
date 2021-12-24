import React, { useState } from "react";
import { localeOption } from "primereact/api";
import { selectStorageGroupId } from "../app/appSlice";
import { useAppSelector } from "../../hooks/store";
import { useGetHistoryQuery, Prostava } from "../../app/services";

import { DataView, DataViewLayoutOptions, DataViewLayoutType } from "primereact/dataview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Rating } from "primereact/rating";
import { DateText } from "../commons/DateTime";
import { CostText } from "../commons/Cost";
import { VenueLink } from "../commons/Venue";
import { ProfileButton } from "../profile/ProfileButton";
import { ProstavaNameChip } from "./ProstavaNameChip";
import { ProstavaCard } from "./ProstavaCard";
import { ProstavaStatusTag } from "./ProstavaStatusTag";
import { ProstavaParticipantsGroup } from "./ProstavaParticipantsGroup";
import { ProstavaRating } from "./ProstavaRating";
import { Calendar } from "../prime/Calendar";
import { InputNumber } from "../prime/InputNumber";
import { ProfileChip } from "../profile/ProfileChip";

export function History() {
    const [filterValue, setFilterValue] = useState<string>("");
    const [layoutView, setLayoutView] = useState<DataViewLayoutType>("grid");

    const groupId = useAppSelector(selectStorageGroupId);

    const { data: prostavas, isFetching: isProstavasFetching } = useGetHistoryQuery(groupId!);

    const t = localeOption("prostava");

    const statuses = Array.from(
        prostavas?.reduce((statuses, prostava) => {
            statuses.add(prostava.status);
            return statuses;
        }, new Set()) || []
    );

    const venues = Array.from(
        prostavas?.reduce((venues, prostava) => {
            if (prostava.venue.name) {
                venues.add(prostava.venue.name);
            }
            return venues;
        }, new Set()) || []
    );

    let authorIds = new Set();
    const authors = prostavas
        ?.filter((prostava) => {
            if (authorIds.has(prostava.author.id)) {
                return false;
            } else {
                authorIds.add(prostava.author.id);
                return true;
            }
        })
        .map((prostava) => prostava.author);

    const headerTemplate = (
        <div className="flex justify-content-between align-items-center">
            <span className="mx-1">
                <DataViewLayoutOptions
                    layout={layoutView}
                    onChange={(e) => {
                        setLayoutView(e.value);
                    }}
                />
            </span>
            <span className="p-input-icon-right w-8 sm:w-7 md:w-6 lg:w-5 xl:w-4">
                <i className="pi pi-search" />
                <InputText
                    value={filterValue}
                    onChange={(e) => {
                        setFilterValue(e.target.value);
                    }}
                    placeholder={localeOption("keywordSearch")}
                    className="w-full"
                />
            </span>
        </div>
    );

    const prostavaGridTemplate = (prostava: Prostava, layout: DataViewLayoutType) => {
        return (
            <div className="col-12 sm:col-6 md:col-4 lg:col-3 xl:col-2 p-2">
                <ProstavaCard prostava={prostava} />
            </div>
        );
    };

    return layoutView === "grid" ? (
        <DataView
            value={prostavas?.filter(
                (prostava) =>
                    new RegExp(`${filterValue}`, "i").test(prostava.name) ||
                    new RegExp(`${filterValue}`, "i").test(prostava.author.name)
            )}
            layout="grid"
            itemTemplate={prostavaGridTemplate}
            header={headerTemplate}
            sortField="date"
            sortOrder={-1}
            loading={isProstavasFetching}
            className="p-2"
        />
    ) : (
        <DataTable
            value={prostavas?.map((prostava) => ({ ...prostava, date: new Date(prostava.date) }))}
            rows={5}
            header={headerTemplate}
            loading={isProstavasFetching}
            rowGroupMode="rowspan"
            groupRowsBy="author.name"
            sortMode="multiple"
            multiSortMeta={[{ field: "date", order: -1 }]}
            removableSort
            filterDisplay="menu"
            filters={{
                global: { value: filterValue, matchMode: "contains" },
                name: { operator: "and", constraints: [{ value: null, matchMode: "contains" }] },
                status: { value: null, matchMode: "in" },
                date: { operator: "and", constraints: [{ value: null, matchMode: "dateIs" }] },
                amount: { operator: "and", constraints: [{ value: null, matchMode: "equals" }] },
                "venue.name": { value: null, matchMode: "in" },
                author: { value: null, matchMode: "in" },
                rating: { operator: "and", constraints: [{ value: null, matchMode: "equals" }] }
            }}
            globalFilterFields={["name", "author.name"]}
            breakpoint="900px"
            tableClassName="w-full"
            className="p-2"
        >
            <Column
                header={t["name"]}
                body={(prostava: Prostava) => <ProstavaNameChip prostava={prostava} />}
                field="name"
                sortable
                sortField="name"
                filter
                filterField="name"
                filterPlaceholder={t["nameSearch"]}
                showFilterMenuOptions={false}
                showApplyButton={false}
                showClearButton={false}
                style={{ width: "18%" }}
            />
            <Column
                header={t["status"]}
                body={(prostava: Prostava) => <ProstavaStatusTag status={prostava.status} />}
                field="status"
                sortable
                sortField="status"
                filter
                filterField="status"
                showFilterMenuOptions={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <MultiSelect
                        value={options.value}
                        options={statuses}
                        itemTemplate={(status) => <ProstavaStatusTag status={status} />}
                        selectedItemTemplate={(status) => status && <ProstavaStatusTag status={status} />}
                        onChange={(e) => {
                            options.filterApplyCallback(e.value);
                        }}
                        placeholder={t["statusSearch"]}
                        maxSelectedLabels={1}
                    />
                )}
                style={{ width: "11%" }}
            />
            <Column
                header={t["date"]}
                body={(prostava: Prostava) => <DateText date={prostava.date} />}
                field="date"
                sortable
                sortField="date"
                filter
                filterField="date"
                showFilterOperator={false}
                showAddButton={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <Calendar
                        value={options.value}
                        onChange={(e) => options.filterApplyCallback(e.value)}
                        dateFormat="dd/mm/yy"
                        placeholder="dd/mm/yyyy"
                        mask="99/99/9999"
                    />
                )}
                dataType="date"
                style={{ width: "10%" }}
            />
            <Column
                header={t["cost"]}
                body={(prostava: Prostava) => <CostText amount={prostava.amount!} currency={prostava.currency!} />}
                field="amount"
                sortable
                sortField="amount"
                filter
                filterField="amount"
                showFilterOperator={false}
                showAddButton={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <InputNumber
                        value={options.value}
                        onChange={(e) => {
                            options.filterApplyCallback(e.value);
                        }}
                        useGrouping
                        placeholder={t["costSearch"]}
                    />
                )}
                dataType="numeric"
                style={{ width: "10%" }}
            />
            <Column
                header={t["venue"]}
                body={(prostava: Prostava) => <VenueLink venue={prostava.venue} />}
                field="venue.name"
                sortable
                sortField="venue.name"
                filter
                filterField="venue.name"
                showFilterMenuOptions={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <MultiSelect
                        value={options.value}
                        options={venues}
                        onChange={(e) => {
                            options.filterApplyCallback(e.value);
                        }}
                        placeholder={t["venueSearch"]}
                        maxSelectedLabels={1}
                    />
                )}
                style={{ width: "12%" }}
            />
            <Column
                header={t["author"]}
                body={(prostava: Prostava) => <ProfileButton profile={prostava.author} />}
                field="author.name"
                sortable
                sortField="author.name"
                filter
                filterField="author"
                showFilterMenuOptions={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <MultiSelect
                        value={options.value}
                        options={authors}
                        itemTemplate={(author) => <ProfileChip profile={author} />}
                        selectedItemTemplate={(author) => author && <ProfileChip profile={author} />}
                        onChange={(e) => {
                            options.filterApplyCallback(e.value);
                        }}
                        placeholder={t["authorSearch"]}
                        maxSelectedLabels={1}
                    />
                )}
                style={{ width: "15%" }}
            />
            <Column
                header={t["participants"]}
                body={(prostava: Prostava) => <ProstavaParticipantsGroup prostava={prostava} />}
                field="participants"
                style={{ width: "12%" }}
            />
            <Column
                header={t["rating"]}
                body={(prostava: Prostava) => <ProstavaRating rating={prostava.rating} readOnly />}
                field="rating"
                sortable
                sortField="rating"
                filter
                filterField="rating"
                showFilterOperator={false}
                showAddButton={false}
                showApplyButton={false}
                showClearButton={false}
                filterElement={(options) => (
                    <Rating value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
                )}
                dataType="numeric"
                style={{ width: "12%" }}
            />
        </DataTable>
    );
}
