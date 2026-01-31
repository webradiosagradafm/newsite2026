import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Passando os dados como objeto para satisfazer a tipagem do SupabaseAuthClient
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) console.error('Erro:', error.message);
    else console.log('Usuário criado:', data);
  };

  return (
    <div className="p-4">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
      <button onClick={handleSignUp}>Cadastrar</button>
    </div>
  );
};