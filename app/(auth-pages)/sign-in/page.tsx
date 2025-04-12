import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <form className="flex-1 flex flex-col min-w-64" noValidate>
      <h1 className="text-2xl font-medium">Iniciar Sesión</h1>
      <p className="text-sm text-foreground">
        No tienes una cuenta?{" "}
        <Link className="text-foreground font-medium underline" href="/sign-up">
          Regístrate
        </Link>
      </p>
      <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
        <Label htmlFor="email">Correo</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
          title="Ingresa un correo electrónico válido"
        />

        <div className="flex justify-between items-center">
          <Label htmlFor="password">Contraseña</Label>
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Olvidaste tú contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          name="password"
          placeholder="Your password"
          required
          minLength={6}
          title="La contraseña debe tener al menos 6 caracteres"
        />

        <SubmitButton pendingText="Inciando sesión..." formAction={signInAction}>
          Iniciar Sesión
        </SubmitButton>

        <FormMessage message={searchParams} />
      </div>
    </form>
  );
}
