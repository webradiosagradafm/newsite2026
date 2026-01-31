import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) console.error('Erro:', error.message);
    else console.log('Usuário criado:', data);
  };

  return (
    <div>
      <form onSubmit={handleSignUp}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default SignUpPage; // Adicionado export default