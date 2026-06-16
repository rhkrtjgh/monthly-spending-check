import {
  Children,
  isValidElement,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import "./tds-preview.css";

type CommonProps = {
  className?: string;
  children?: ReactNode;
};

export function Button({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & CommonProps) {
  return (
    <button type="button" className={`tds-preview-button ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}

function TitleParagraph({ children, size }: { children?: ReactNode; size?: number }) {
  return (
    <p className="tds-preview-top__title" style={{ fontSize: size }}>
      {children}
    </p>
  );
}

function SubtitleParagraph({
  children,
  size,
}: {
  children?: ReactNode;
  size?: number;
}) {
  return (
    <p className="tds-preview-top__subtitle" style={{ fontSize: size }}>
      {children}
    </p>
  );
}

export function Top({
  title,
  subtitleBottom,
}: {
  title?: ReactNode;
  subtitleBottom?: ReactNode;
}) {
  return (
    <header className="tds-preview-top">
      {title}
      {subtitleBottom}
    </header>
  );
}

Top.TitleParagraph = TitleParagraph;
Top.SubtitleParagraph = SubtitleParagraph;

export function CTAButton({
  children,
  className,
  display,
  variant,
  size,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  display?: string;
  variant?: string;
  size?: string;
}) {
  return (
    <button
      type="button"
      className={`tds-preview-cta ${variant === "weak" ? "tds-preview-cta--weak" : ""} ${className ?? ""}`}
      style={{ width: display === "block" ? "100%" : undefined }}
      {...props}
    >
      {children}
    </button>
  );
}

function BottomCTASingle({
  children,
  onClick,
  disabled,
}: {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fixed?: boolean;
  background?: string;
}) {
  return (
    <div className="tds-preview-bottom-cta">
      <CTAButton size="xlarge" display="block" onClick={onClick} disabled={disabled}>
        {children}
      </CTAButton>
    </div>
  );
}

function BottomCTADouble({
  leftButton,
  rightButton,
}: {
  leftButton?: ReactNode;
  rightButton?: ReactNode;
  fixed?: boolean;
  background?: string;
}) {
  return (
    <div className="tds-preview-bottom-cta tds-preview-bottom-cta--double">
      {leftButton}
      {rightButton}
    </div>
  );
}

export const BottomCTA = {
  Single: BottomCTASingle,
  Double: BottomCTADouble,
};

function TextFieldClearable({
  label,
  placeholder,
  value,
  onChange,
  suffix,
  inputMode,
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  suffix?: string;
  variant?: string;
}) {
  return (
    <label className="tds-preview-field">
      {label ? <span className="tds-preview-field__label">{label}</span> : null}
      <div className="tds-preview-field__input-wrap">
        <input
          className="tds-preview-field__input"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          inputMode={inputMode}
        />
        {suffix ? <span className="tds-preview-field__suffix">{suffix}</span> : null}
      </div>
    </label>
  );
}

export const TextField = {
  Clearable: TextFieldClearable,
};

function SegmentedControlItem({ children }: { children?: ReactNode; value?: string }) {
  return <>{children}</>;
}

function SegmentedControl({
  children,
  value,
  onChange,
}: {
  children?: ReactNode;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div className="tds-preview-segmented" role="tablist">
      {Children.map(children, (child) => {
        if (!isValidElement(child)) {
          return null;
        }

        const item = child as ReactElement<{ value: string; children?: ReactNode }>;
        const itemValue = item.props.value;
        const selected = value === itemValue;

        return (
          <button
            key={itemValue}
            type="button"
            role="tab"
            aria-selected={selected}
            className={`tds-preview-segmented__item${selected ? " tds-preview-segmented__item--selected" : ""}`}
            onClick={() => onChange?.(itemValue)}
          >
            {item.props.children}
          </button>
        );
      })}
    </div>
  );
}

SegmentedControl.Item = SegmentedControlItem;

export { SegmentedControl };
