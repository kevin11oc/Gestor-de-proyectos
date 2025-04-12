import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUserAndRole } from "@/utils/auth/get-user-role";

export async function GET() {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let query = supabase.from("projects").select(`
    id,
    title,
    description,
    attachments,
    created_at,
    designer_id,
    profiles!projects_designer_id_fkey1(name)
  `);

  switch (role) {
    case "cliente":
      query = query.eq("created_by", user.id);
      break;
    case "disenador":
      query = query.eq("designer_id", user.id);
      break;
    case "pm":
      break;
    default:
      return NextResponse.json({ error: "Rol no válido" }, { status: 403 });
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}


export async function POST(req: Request) {
  const supabase = await createClient();
  const { user } = await getUserAndRole();
  if (!user)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = await req.json();

  const { title, description, attachments } = body;

  const { data, error } = await supabase.from("projects").insert({
    title,
    description,
    attachments,
    created_by: user.id,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 200 });
}
