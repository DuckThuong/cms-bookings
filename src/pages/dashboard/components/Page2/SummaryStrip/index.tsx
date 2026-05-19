
interface SummaryStripProps {
  items: { key: string; label: string; color: string; value: number }[]
}

const SummaryStrip = ({ items }: SummaryStripProps) => (
  <div className="bm-summary-strip">
    {items.map((item) => (
      <div className="bm-summary-strip__item" key={item.key}>
        <span
          className="bm-summary-strip__dot"
          style={{ background: item.color }}
        />
        <span className="bm-summary-strip__label">{item.label}</span>
        <span
          className="bm-summary-strip__value"
          style={{ color: item.color }}
        >
          {item.value}
        </span>
      </div>
    ))}
  </div>
);

export default SummaryStrip;