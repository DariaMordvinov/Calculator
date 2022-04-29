import React, { useReducer, useState } from "react";
import "./styles.css";
import DigitButton from "./components/digitButton";
import OperationButton from "./components/operationButton";


// Types of actions the user can perform (so we don't have to type each action again and again)
export const ACTIONS = {
  ADD_DIGIT: 'add_digit',
  CLEAR: 'clear',
  CHOOSE_OPERATION: 'choose_operation',
  DELETE_DIGIT: 'delete_digit',
  EVALUATE: 'evaluate;'
}

// For formatting the operands
const FORMATTER = new Intl.NumberFormat("en-us", { maximumFractionDigits: 0 });

function formatOperand(operand) {
  if (operand == null) return;
  if (operand === '-') return '-';
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return FORMATTER.format(integer);
  return operand;
}


// Function for performing operations on numbers
function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);
  if (isNaN(current) || isNaN(previous)) return "";
  switch (operation) {
    case "+":
      return (current + previous).toString();
    case "-":
      return (previous - current).toString();
    case "*":
      return (current * previous).toString();
    case "/":
      // We can't divide numbers by zero, error check
      if (current === 0) {
        throw new Error("Can't divide by zero");
      }
      return (previous / current).toString();
    default: return "";
  }

}

// The reducer function
function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (payload.digit === "." && state.currentOperand == null) return {
        ...state,
        currentOperand: `0.`
      }
      if (payload.digit === '.' && state.currentOperand === '-') return {
        ...state,
        currentOperand: `-0.`
      }
      if (payload.digit === '.' && state.currentOperand.includes('.')) return state;

      if (payload.digit === 0 && state.currentOperand === 0) return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.currentOperand == null) return {};
      return {
        ...state,
        currentOperand: `${state.currentOperand.slice(0, -1)}`
      }
    case ACTIONS.CHOOSE_OPERATION:
      if (state.previousOperand == null && state.currentOperand == null) {
        return payload.operation === '-' ? { ...state, currentOperand: `-` } : state;
      }
      if (state.previousOperand == null)
        return {
          ...state,
          previousOperand: `${state.currentOperand}`,
          operation: payload.operation,
          currentOperand: null
        }
      if (state.operation != null && state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation
        }


      // Error check for zero
      try {
        evaluate(state);
      }
      catch (e) {
        console.error(e);
        return {};
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }

    case ACTIONS.EVALUATE:
      if (state.operation == null || state.previousOperand == null || state.currentOperand == null)
        return state;

      // Error check for zero
      try {
        evaluate(state);
      }
      catch (e) {
        console.error(e);
        return {};
      }

      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }
    default:
      return state;
  }
}

function App() {
  // useReducer: for performing actions
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer, {}
  );

  // useState: for creating digit numbers
  const [rows] = useState(
    { 0: [1, 2, 3], 1: [4, 5, 6], 2: [7, 8, 9] },
  );

  return (
    <div className="calculator-grid">
      <div className="display">
        <div className="previous-operand">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operand">{
          formatOperand(currentOperand)}
        </div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton
        dispatch={dispatch}
        operation="/"
        value="÷"
      />
      {rows[0].map(d =>
        <DigitButton
          digit={d}
          dispatch={dispatch}
          key={d}
        />)}
      <OperationButton
        dispatch={dispatch}
        operation="*"
        value="*"
      />
      {rows[1].map(d =>
        <DigitButton
          digit={d}
          dispatch={dispatch}
          key={d}
        />)}
      <OperationButton
        dispatch={dispatch}
        operation="+"
        value="+"
      />
      {rows[2].map(d =>
        <DigitButton
          digit={d}
          dispatch={dispatch}
          key={d}
        />)}
      <OperationButton
        dispatch={dispatch}
        operation="-"
        value="-"
      />
      <DigitButton
        digit="."
        dispatch={dispatch}
        key="."
        style={{ borderRadius: '0 0 0 20px' }}
      />
      <DigitButton
        digit="0"
        dispatch={dispatch}
        key="0"
      />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
        style={{ borderRadius: '0 0 20px 0' }}
      >=</button>
    </div >
  );
}

export default App;
