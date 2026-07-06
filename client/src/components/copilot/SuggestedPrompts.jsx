const prompts = [
  "How can I improve my MVP?",
  "Who are my competitors?",
  "Suggest a pricing strategy.",
  "How can I get my first 100 users?",
  "Should I raise funding now?",
];

export default function SuggestedPrompts({
  onSelect,
}) {
  return (
    <div className="suggestions">
      {prompts.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}