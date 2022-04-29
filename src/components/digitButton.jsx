import React from "react";
import { ACTIONS } from "../App";

const DigitButton = ({ dispatch, digit, style }) => {
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
            style={style}
        >
            {digit}
        </button>
    );
}

export default DigitButton;