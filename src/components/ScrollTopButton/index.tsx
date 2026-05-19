import { FloatButton } from "antd";
import "./style.scss";

interface ScrollTopButtonProps {
  className?: string;
  threshold?: number;
  label?: string;
}

export const ScrollTopButton = ({
  className = "",
  threshold = 300,
  label = "Lên đầu trang",
}: ScrollTopButtonProps) => {
  return (
    <FloatButton.BackTop
      visibilityHeight={threshold}
      className={`scroll-top-btn ${className}`.trim()}
      tooltip={label}
    />
  );
};

