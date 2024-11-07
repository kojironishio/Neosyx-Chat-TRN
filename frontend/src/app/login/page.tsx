"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { login, error } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="flex flex-col w-full max-w-sm p-6 bg-white rounded-lg shadow-md lg:max-w-md">
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-700">Bem-vindo ao Chat do Call Center</h1>
        <form className="flex flex-col" onSubmit={handleLogin}>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 mb-4 text-sm text-gray-700 placeholder-gray-500 border rounded-lg focus:border-blue-400 focus:outline-none"
            type="text"
            placeholder="Digite seu email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 mb-4 text-sm text-gray-700 placeholder-gray-500 border rounded-lg focus:border-blue-400 focus:outline-none"
            type="password"
            placeholder="Digite sua senha"
          />
          <button
            className="w-full px-4 py-2 mb-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none"
            type="submit"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600">
            Não tem uma conta?{" "}
            <a className="text-blue-500 hover:underline" href="/register">Clique aqui</a>
          </p>
          {error && <p className="mt-2 text-center text-sm text-red-600">{error.message}</p>}
        </form>
      </div>
    </main>
  );
};

export default Page;
