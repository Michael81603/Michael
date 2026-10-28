import { useState } from "react";

export default function ReactStatus() {
  const [active, setActive] = useState(false);

  return (
    <div className="react-status">
      <p aria-live="polite">
        React : <strong>{active ? "interaction fonctionnelle" : "prêt à être testé"}</strong>
      </p>
      <button type="button" onClick={() => setActive((current) => !current)}>
        {active ? "Réinitialiser" : "Tester React"}
      </button>
    </div>
  );
}

