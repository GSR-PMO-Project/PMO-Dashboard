function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="shared-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`shared-tab ${activeTab === tab.key ? "active" : ""}`}
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;