'use client'

import { useEffect, useState } from "react";

import UserCard from "../components/UserCard";
import socket from '@/lib/socket'
import { useUser } from "@/context/UserContext";

const Nav = () => {
  const [users, setUsers] = useState<User[]>([])
  const [onlineUsers, setOnlineUsers] = useState<User[]>([])
  const {setSelectedUser} = useUser()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:8888/api/auth/users');
        if (!response.ok) {
          throw new Error('Erro ao buscar usuários');
        }
  
        const data = await response.json();
        setUsers(data.map((user: any) => ({ ...user, stats: 2 })));
  
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };
  
    fetchUsers();
  
    socket.on('users-online', (onlineUsers: User[]) => {

      setUsers(prevUsers => 
        prevUsers.map(user => ({
          ...user,
          stats: onlineUsers.some(onlineUser => onlineUser.id === user.id) ? 1 : 2
        }))
      );
    });
  
    return () => {
      socket.off('users-online');
    };
  }, []);



  return (
    <nav className="h-screen p-4 bg-[#2d2d2d]">
    <div className="flex flex-col items-left space-y-4">
      <h2 className="text-white text-xl font-semibold mb-4">Usuários Online</h2>      
        {users.length <= 1 ? (<p>No users</p>) : 
        /* @ts-expect-error: */
        (users.filter((user) => user.name != socket?.auth?.user?.name).map((user, index) => (
          <button key={index} onClick={() => setSelectedUser(user)}>
            <li >
              <UserCard user={user}/>
            </li>
          </button>
        )))}
      </div>
    </nav>
  );
};

export default Nav;
