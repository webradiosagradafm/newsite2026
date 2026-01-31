import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Na v2, o método correto é signInWithPassword
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) alert(error.message);
    else console.log('Sucesso:', data);
  };

  return (
    <div className="p-4">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};