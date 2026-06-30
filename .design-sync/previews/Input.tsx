import { Input } from 'orkestrator-next';

const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 8, width: 260 };

export function States() {
  return (
    <div style={col}>
      <Input placeholder="Search workflows…" />
      <Input defaultValue="orkestrator-next" />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}

export function Types() {
  return (
    <div style={col}>
      <Input type="email" placeholder="user@lab.org" />
      <Input type="password" defaultValue="supersecret" />
      <Input type="number" defaultValue={42} />
    </div>
  );
}

export function Validation() {
  return (
    <div style={col}>
      <Input defaultValue="bad-email" aria-invalid="true" />
      <Input placeholder="Required field" aria-invalid="true" />
    </div>
  );
}
