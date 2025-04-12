import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import type { NextRequest } from "next/server";
import { getUserAndRole } from "@/utils/auth/get-user-role";

type Context = {
  params: {
    id: string;
  };
};

export async function GET(_: NextRequest) {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  let query = supabase.from("projects").select("*");

  switch (role) {
    case "cliente":
      query = query.eq("created_by", user.id);
      break;
    case "disenador":
      query = query.eq("designer_id", user.id);
      break;
    case "pm":
      // PM ve todo, sin filtros
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

export async function PUT(req: NextRequest, context: Context) {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole();
  if (!user)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  if (role !== "pm") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { id } = await context.params;

  const { error } = await supabase
    .from("projects")
    .update({ title: body.title, description: body.description, attachments: body.attachments, designer_id: body.designer_id })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Project updated" });
}

export async function DELETE(_: NextRequest, context: Context) {
  const supabase = await createClient();
  const { user, role } = await getUserAndRole();
  if (!user)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  if (role !== "pm") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id } = await context.params;

  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: "Project deleted" }, { status: 200 });
}
