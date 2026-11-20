import React, { useState } from 'react';
import TelaLogin from './TelaLogin';
import TelaInicial from './TelaInicial';

export default function App() {
  const [logado, setLogado] = useState(false);

  if (logado) {
    return <TelaInicial aoSair={() => setLogado(false)} />;
  }

  return <TelaLogin aoEntrar={() => setLogado(true)} />;
}
