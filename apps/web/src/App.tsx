import { useEffect, useState } from 'react';
import type { HealthResponse } from '@projectops/shared';

type LoadState =
  | { kind: 'idle' | 'loading' }
  | { kind: 'success'; data: HealthResponse }
  | { kind: 'error'; message: string };

export default function App() {
  const [state, setState] = useState<LoadState>({ kind: 'idle' });

  async function load() {
    try {
      setState({ kind: 'loading' });
      const res = await fetch('/api/health');
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = (await res.json()) as HealthResponse;
      setState({ kind: 'success', data });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      setState({ kind: 'error', message: msg });
    }
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui', padding: 24 }}>
      <h1>ProjectOps</h1>
      <p>Smoke integration (Web → API)</p>

      {state.kind === 'loading' || state.kind === 'idle' ? <p>Loading…</p> : null}

      {state.kind === 'success' ? (
        <p>
          API health: <strong>{state.data.status}</strong>
        </p>
      ) : null}

      {state.kind === 'error' ? (
        <div>
          <p>
            API health: <strong>ERROR</strong> ({state.message})
          </p>
          <button onClick={() => void load()}>Retry</button>
        </div>
      ) : null}
    </div>
  );
}
