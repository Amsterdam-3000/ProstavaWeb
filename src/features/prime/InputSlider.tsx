import React from "react";
import classNames from "classnames";

import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { Slider, SliderProps } from "primereact/slider";

export interface InputSliderProps extends InputNumberProps, Omit<Omit<SliderProps, "onChange">, "value"> {}

export function InputSlider(props: InputSliderProps) {
    const inputNumberProps: InputNumberProps = { ...props };
    const { id, ...sliderProps } = { ...props };
    return (
        <React.Fragment>
            <InputNumber
                className="input-slider"
                {...inputNumberProps}
                inputClassName={classNames({ "border-round": props.readOnly, "opacity-100": props.readOnly })}
                disabled={props.disabled || props.readOnly}
            />
            {props.readOnly ? null : <Slider className="input-slider" {...sliderProps} />}
        </React.Fragment>
    );
}
