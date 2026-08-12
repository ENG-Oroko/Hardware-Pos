import { forwardRef } from "react";

/**
 * Base text input with consistent label/error/help-text handling.
 * Feature forms should compose this rather than styling raw <input>s.
 */
const Input = forwardRef(function Input(
  { label, error, helpText, id, className = "", required = false, ...rest },
  ref
) {
  const inputId = id || rest.name;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-md border px-3 py-2 text-sm text-slate-900 shadow-sm
          placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500
          disabled:bg-slate-100 disabled:text-slate-400
          ${error ? "border-red-400 focus:ring-red-400" : "border-slate-300"}
          ${className}`}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : helpText ? (
        <p className="mt-1 text-xs text-slate-500">{helpText}</p>
      ) : null}
    </div>
  );
});

export default Input;
