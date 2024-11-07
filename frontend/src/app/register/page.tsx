"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { register, error } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await register(name, username, password, passwordConfirmation);
  };

  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="flex flex-col w-full max-w-md p-6 text-center text-black bg-white rounded-lg shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Página de Registro</h1>
        <form className="flex flex-col items-center gap-4" onSubmit={handleRegister}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="text"
            placeholder="Digite seu nome"
            required
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="email"
            placeholder="Digite seu email"
            required
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="password"
            placeholder="Digite sua senha"
            required
          />
          <input
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="w-full p-3 text-black bg-white border border-gray-300 rounded-lg outline-none"
            type="password"
            placeholder="Confirme sua senha"
            required
          />
          <button
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none"
            type="submit"
          >
            Registrar
          </button>
          <p>Já tem uma conta?</p>
          <a className="text-blue-600 hover:underline" href="/login">Clique aqui</a>

          {error && <p className="text-red-600">{error.message}</p>}
        </form>
      </div>
    </main>
  );
};

export default Page;
