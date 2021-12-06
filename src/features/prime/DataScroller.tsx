import React, { useRef } from "react";
import classNames from "classnames";

import {
    DataScroller as DataScrollerPrime,
    DataScrollerProps as DataScrollerPrimeProps
} from "primereact/datascroller";
import { BlockUI } from "primereact/blockui";
import { Button } from "primereact/button";

export interface DataScrollerProps extends DataScrollerPrimeProps {
    loading?: boolean;
    ref?: React.LegacyRef<DataScrollerPrime>;
}

export function DataScroller(props: DataScrollerProps) {
    const dataScrollerRef = useRef<DataScrollerPrime>(null);

    return (
        <BlockUI blocked={props.loading} template={<i className="pi pi-spin pi-spinner text-4xl" />}>
            <DataScrollerPrime
                {...props}
                ref={dataScrollerRef}
                className={classNames(props.className, "border-x- border-roun border-")}
                footer={
                    props.loader && props.rows && props.value && props.rows < props.value?.length ? (
                        <Button
                            icon="pi pi-plus"
                            label="More"
                            onClick={() => {
                                dataScrollerRef.current && dataScrollerRef.current.load();
                            }}
                            className="p-button-link"
                        />
                    ) : null
                }
            />
        </BlockUI>
    );
}
