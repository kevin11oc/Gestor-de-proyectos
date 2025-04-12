import { useEffect, useState } from "react";

export function useUserRole() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setRole(data.role);
    };

    fetchRole();
  }, []);

  return role;
}
