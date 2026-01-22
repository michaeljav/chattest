// app/page.tsx
export default function Page() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>Zammad Chat Demo</h1>
      <p>
        Si el chat está habilitado en Zammad y hay agentes disponibles, deberías
        ver el widget en esta página.
      </p>

      <ul>
        <li>Verifica en Zammad: Admin → Channels → Chat</li>
        <li>
          Recuerda: el widget solo se muestra si al menos un agente está
          disponible (según configuración).
        </li>
      </ul>
    </main>
  );
}
