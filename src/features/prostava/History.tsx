import React, { useState } from "react";

import { useSelector } from "react-redux";
import { selectStorageGroupId } from "../app/appSlice";
import { useGetHistoryQuery, Prostava } from "../../app/services";

import { DataView, DataViewLayoutOptions, DataViewLayoutType } from "primereact/dataview";
import { DataTable } from "primereact/datatable";
import { Column, ColumnFilterElementTemplateOptions } from "primereact/column";
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

    const groupId = useSelector(selectStorageGroupId);

    const { data: prostavas, isFetching: isProstavasFetching } = useGetHistoryQuery(groupId!);

    const statuses = Array.from(
        prostavas?.reduce((statuses, prostava) => {
            statuses.add(prostava.status);
            return statuses;
        }, new Set()) || []
    );

    let venueIds = new Set();
    const venues = prostavas
        ?.filter((prostava) => {
            if (!prostava.venue.name || venueIds.has(prostava.venue.name)) {
                return false;
            } else {
                venueIds.add(prostava.venue.name);
                return true;
            }
        })
        .map((prostava) => prostava.venue);

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
            <span className="p-input-icon-right">
                <i className="pi pi-search" />
                <InputText
                    value={filterValue}
                    onChange={(e) => {
                        setFilterValue(e.target.value);
                    }}
                    placeholder="Name or author"
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
                venue: { value: null, matchMode: "in" },
                author: { value: null, matchMode: "in" },
                rating: { operator: "and", constraints: [{ value: null, matchMode: "equals" }] }
            }}
            globalFilterFields={["name", "author.name"]}
            breakpoint="900px"
            className="p-2"
        >
            <Column
                header="Name"
                body={(prostava: Prostava) => <ProstavaNameChip prostava={prostava} />}
                field="name"
                sortable
                sortField="name"
                filter
                filterField="name"
                filterPlaceholder="Search by name"
                showFilterMenuOptions={false}
                showApplyButton={false}
                showClearButton={false}
            />
            <Column
                header="Status"
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
                        placeholder="Search by status"
                        maxSelectedLabels={1}
                    />
                )}
            />
            <Column
                header="Date"
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
            />
            <Column
                header="Cost"
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
                        placeholder="Search by cost"
                    />
                )}
                dataType="numeric"
            />
            <Column
                header="Venue"
                body={(prostava: Prostava) => <VenueLink venue={prostava.venue} />}
                field="venue.name"
                sortable
                sortField="venue.name"
                filter
                filterField="venue"
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
                        placeholder="Search by venue"
                        optionLabel="name"
                        maxSelectedLabels={1}
                    />
                )}
            />
            <Column
                header="Author"
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
                        placeholder="Search by author"
                        maxSelectedLabels={1}
                    />
                )}
            />
            <Column
                header="Participants"
                body={(prostava: Prostava) => <ProstavaParticipantsGroup prostava={prostava} />}
                field="participants"
            />
            <Column
                header="Rating"
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
            />
        </DataTable>
    );
}
