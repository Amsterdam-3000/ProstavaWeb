import React, { useEffect, useState } from "react";
import { localeOption } from "primereact/api";
import classNames from "classnames";
import { useController, useFormContext } from "react-hook-form";
import { ProstavaVenue } from "../../app/services";

import { VenuePickerMap } from "../map/VenuePickerMap";

interface ImagePickerVenueAddressProps {
    name: string;
    required?: boolean;
    readOnly?: boolean;
    disabled?: boolean;
    className?: string;
}

export function ImagePickerVenueAddress(props: ImagePickerVenueAddressProps) {
    const [edit, setEdit] = useState(false);

    const t = localeOption("form")[props.name];

    const { field } = useController({
        name: props.name,
        rules: {
            validate: (venue: ProstavaVenue) =>
                !venue.name && props.required && t
                    ? t["isRequired"]
                    : !(venue.latitude && venue.longitude) && props.required && t
                    ? t["addressIsRequired"]
                    : true
        }
    });
    const { watch, getValues } = useFormContext();

    const venue = field.value as ProstavaVenue;
    const timezone = getValues()["timezone"];

    useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === props.name || name === "timezone") {
                setEdit(false);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, [watch, props.name]);

    return edit ? (
        <VenuePickerMap
            city={timezone && timezone.includes("/") ? timezone.replace(/.+\//, "") : undefined}
            name={venue.name}
            coordinates={venue.latitude && venue.longitude ? [venue.latitude, venue.longitude] : undefined}
            onCancel={() => {
                setEdit(false);
            }}
            onSelect={(coordinates, name, address) => {
                field.onChange({
                    ...field.value,
                    address: address,
                    name: name,
                    latitude: coordinates && coordinates[0],
                    longitude: coordinates && coordinates[1],
                    photo:
                        coordinates &&
                        //TODO API yandex
                        "https://static-maps.yandex.ru/1.x/?size=512,288&z=13&scale=1.5&l=map" +
                            `&ll=${coordinates[1]},${coordinates[0]}` +
                            `&pt=${coordinates[1]},${coordinates[0]},pm2vvm`
                });
            }}
        />
    ) : (
        <div
            className={classNames(props.className, "border-round", {
                "p-disabled": props.disabled,
                "p-image-preview-container": !props.readOnly && !props.disabled
            })}
            onClick={
                !props.readOnly && !props.disabled
                    ? () => {
                          setEdit(true);
                      }
                    : undefined
            }
        >
            <img
                //TODO API yandex
                src={venue.photo || "https://static-maps.yandex.ru/1.x/?size=512,288&z=0&l=map&ll=0,0&scale=1.5"}
                width={320}
                alt={venue.name}
                className="border-round"
            />
            {!props.readOnly && !props.disabled ? (
                <div className="p-image-preview-indicator text-white">
                    <i className="p-image-preview-icon pi pi-map-marker"></i>
                </div>
            ) : null}
        </div>
    );
}
