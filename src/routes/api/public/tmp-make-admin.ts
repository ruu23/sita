import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/tmp-make-admin")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { email, password } = (await request.json()) as { email: string; password: string };
        if (email !== "team.sita.ai@gmail.com") return new Response("no", { status: 403 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
        if (error) return new Response(error.message, { status: 400 });
        await supabaseAdmin.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
        return new Response("ok");
      },
    },
  },
});
