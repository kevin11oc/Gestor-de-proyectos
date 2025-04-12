import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <>
      <form className="flex flex-col min-w-64 max-w-64 mx-auto" noValidate>
        <h1 className="text-2xl font-medium">Registro</h1>
        <p className="text-sm text text-foreground">
          Ya tienes una cuenta?{" "}
          <Link className="text-primary font-medium underline" href="/sign-in">
            Inicia sesión
          </Link>
        </p>
        <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
          <Label htmlFor="email">Correo</Label>
          <Input
            type="email"
            name="email"
            placeholder="you@example.com"
            required
            pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          />

          <Label htmlFor="name">Nombre</Label>
          <Input
            name="name"
            placeholder="Tu nombre"
            required
            minLength={2}
            maxLength={50}
          />

          <Label htmlFor="role">Rol</Label>
          <Select name="role" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="pm">Project Manager</SelectItem>
              <SelectItem value="disenador">Diseñador</SelectItem>
            </SelectContent>
          </Select>

          <Label htmlFor="password">Contraseña</Label>
          <Input
            type="password"
            name="password"
            placeholder="Your password"
            required
            minLength={6}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$"
            title="La contraseña debe tener al menos 6 caracteres y contener al menos una letra y un número."
          />

          <SubmitButton formAction={signUpAction} pendingText="Registrando...">
            Sign up
          </SubmitButton>

          <FormMessage message={searchParams} />
        </div>
      </form>
      <SmtpMessage />
    </>
  );
}
