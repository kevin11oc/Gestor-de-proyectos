import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/user");
      const json = await res.json();
      setUser(json.user ?? null);
    };

    fetchUser();
  }, []);

  return user;
}
