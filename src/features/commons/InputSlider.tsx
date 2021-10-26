import { InputNumber, InputNumberProps } from "primereact/inputnumber";
import { Slider, SliderProps } from "primereact/slider";
import React from "react";

interface InputSliderProps extends InputNumberProps, Omit<Omit<SliderProps, "onChange">, "value"> {}

export function InputSlider(props: InputSliderProps) {
    const inputNumberProps: InputNumberProps = { ...props };
    const { id, ...sliderProps } = { ...props };
    return (
        <React.Fragment>
            <InputNumber className="input-slider" {...inputNumberProps} />
            <Slider className="input-slider" {...sliderProps} />
        </React.Fragment>
    );
}
