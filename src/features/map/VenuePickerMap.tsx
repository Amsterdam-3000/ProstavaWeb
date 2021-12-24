import React, { useRef, useState } from "react";
import PrimeReact from "primereact/api";
import { YMaps, YMapsProps, Map, Placemark, SearchControl, ZoomControl, Button } from "react-yandex-maps";

interface VenuePickerMapProps {
    city?: string;
    name?: string;
    address?: string;
    coordinates?: number[];
    onSelect?: (coordinates?: number[], name?: string, address?: string) => void;
    onCancel?: () => void;
}

export function VenuePickerMap(props: VenuePickerMapProps) {
    const ymapsRef = useRef<any>(null);
    const mapRef = useRef<any>(null);
    const searchRef = useRef<any>(null);
    const placemarkRef = useRef<any>(null);

    const [coordinates, setCoordinates] = useState(props.coordinates);
    const [name, setName] = useState(props.name);
    const [address, setAddress] = useState(props.address);

    const getGeoObject = async (request: string | number[]) => {
        try {
            const result = await ymapsRef.current.geocode(request);
            return result.geoObjects ? result.geoObjects.get(0) : null;
        } catch (error) {
            return null;
        }
    };

    const initGeoObjectDate = () => {
        setCoordinates(props.coordinates);
        setName(props.name);
        setAddress(props.address);
    };
    const setGeoObjectData = (geoObject: any) => {
        setCoordinates(geoObject.geometry.getCoordinates());
        setName(geoObject.properties.get("name"));
        setAddress(geoObject.properties.get("address") || geoObject.properties.get("text"));
    };

    return (
        <YMaps
            query={{
                apikey: process.env.REACT_APP_YANDEX_API_KEY,
                lang: convertLocaleToMapsLang(PrimeReact.locale)?.lang
            }}
        >
            <Map
                width={320}
                instanceRef={(ref) => {
                    mapRef.current = ref;
                }}
                defaultState={{ center: [0, 0], zoom: 0 }}
                onClick={(e: any) => {
                    getGeoObject(e.get("coords")).then((geoObject) => {
                        geoObject && setGeoObjectData(geoObject);
                    });
                }}
                onLoad={(ref) => {
                    ymapsRef.current = ref;
                    if (props.coordinates) {
                        mapRef.current.setCenter(props.coordinates, 13);
                        return;
                    }
                    if (props.city) {
                        getGeoObject(props.city).then((geoObject) => {
                            geoObject && mapRef.current.setCenter(geoObject.geometry.getCoordinates(), 7);
                        });
                    }
                }}
                modules={["geocode"]}
            >
                {coordinates && (
                    <Placemark
                        key={coordinates?.join(",")}
                        instanceRef={(ref: any) => {
                            placemarkRef.current = ref;
                        }}
                        defaultOptions={{ draggable: true, preset: "islands#violetDotIcon" }}
                        defaultProperties={{ iconCaption: props.name, hintContent: props.address }}
                        defaultGeometry={props.coordinates}
                        properties={{ iconCaption: name, hintContent: address }}
                        geometry={coordinates}
                        onDragend={(e: any) => {
                            getGeoObject(e.originalEvent.target.geometry.getCoordinates()).then((geoObject) => {
                                geoObject && setGeoObjectData(geoObject);
                            });
                        }}
                    />
                )}
                <Button
                    data={{
                        image: "https://img.icons8.com/color-glass/24/000000/checkmark.png"
                    }}
                    options={{
                        float: "right",
                        selectOnClick: false,
                        visible:
                            coordinates && (!props.coordinates || coordinates.join() !== props.coordinates.join())
                                ? true
                                : false
                    }}
                    onClick={() => {
                        props.onSelect && props.onSelect(coordinates, name, address);
                    }}
                />
                <Button
                    data={{
                        image: "https://img.icons8.com/color-glass/24/000000/delete-sign.png"
                    }}
                    options={{
                        float: "right",
                        selectOnClick: false
                    }}
                    onClick={() => {
                        initGeoObjectDate();
                        props.onCancel && props.onCancel();
                    }}
                />
                <SearchControl
                    instanceRef={(ref) => {
                        searchRef.current = ref;
                    }}
                    options={{ float: "left", noPlacemark: true, provider: "yandex#search" }}
                    onResultselect={(e: any) => {
                        const geoObject = searchRef.current.getResult(e.get("index")).valueOf();
                        setGeoObjectData(geoObject);
                    }}
                />
                <ZoomControl options={{ float: "right" }} />
            </Map>
        </YMaps>
    );
}

function convertLocaleToMapsLang(locale?: string): YMapsProps["query"] {
    switch (locale) {
        case "ru":
            return { lang: "ru_RU" };
        case "en":
            return { lang: "en_RU" };
        default:
            return { lang: "en_RU" };
    }
}
