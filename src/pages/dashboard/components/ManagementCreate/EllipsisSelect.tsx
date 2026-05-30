import { Select, Tooltip } from "antd";
import type { SelectProps } from "antd";
import { type ReactNode } from "react";

const toLabelText = (label: ReactNode | undefined) => {
  if (label === null || label === undefined) return "";
  if (typeof label === "string" || typeof label === "number") {
    return String(label);
  }
  return "";
};

const EllipsisSelect = ({
  className,
  options,
  labelRender,
  optionRender,
  ...rest
}: SelectProps) => {
  const renderEllipsisLabel = (label: ReactNode) => {
    const text = toLabelText(label);
    return (
      <Tooltip title={text || undefined} mouseEnterDelay={0.25}>
        <span className="bm-select-ellipsis-text">{label}</span>
      </Tooltip>
    );
  };

  return (
    <Select
      {...rest}
      options={options}
      className={["bm-select", "bm-select--ellipsis", className]
        .filter(Boolean)
        .join(" ")}
      labelRender={(option) => {
        if (labelRender) {
          return labelRender(option);
        }
        return renderEllipsisLabel(option?.label);
      }}
      optionRender={(option, info) => {
        if (optionRender) {
          return optionRender(option, info);
        }
        return renderEllipsisLabel(option.label);
      }}
    />
  );
};

export default EllipsisSelect;
