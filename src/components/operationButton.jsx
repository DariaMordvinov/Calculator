import React from "react";
import { ACTIONS } from "../App";

const OperationButton = ({ dispatch, operation, value }) => {
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}
        >
            {value}
        </button >
    );
}

export default OperationButton;