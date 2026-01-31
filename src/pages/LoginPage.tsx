import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Verifique se o caminho está correto

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // CORREÇÃO: Usando a instância 'supabase' e o método 'signInWithPassword'
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) console.error('Erro no login:', error.message);
    else console.log('Logado com sucesso:', data);
  };

  return (
    <form onSubmit={handleLogin}>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
};