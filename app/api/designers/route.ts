import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserAndRole } from "@/utils/auth/get-user-role";

export async function GET() {
  const supabase = await createClient();

  const { user, role } = await getUserAndRole();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (role !== "pm") {
    return NextResponse.json({ error: "Solo los PM pueden ver diseñadores" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, name")
    .eq("role", "disenador");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}
