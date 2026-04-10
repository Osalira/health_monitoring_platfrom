import { createServerClient } from '@supabase/ssr';
import { prisma } from '@t1d/database';

/**
 * Extract the actor user ID from the Supabase session in the request.
 * Resolves the Supabase auth email to a DB User ID.
 * Returns undefined if no session or user not found.
 */
export async function getActorFromRequest(request: Request): Promise<string | undefined> {
  if (!process.env['NEXT_PUBLIC_SUPABASE_URL'] || !process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY']) {
    return undefined;
  }

  try {
    const supabase = createServerClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'],
      process.env['NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
      {
        cookies: {
          getAll() {
            const cookieHeader = request.headers.get('cookie') ?? '';
            return cookieHeader.split(';').map((c) => {
              const [name, ...rest] = c.trim().split('=');
              return { name: name ?? '', value: rest.join('=') };
            }).filter((c) => c.name);
          },
          setAll() {
            // Read-only — we don't need to set cookies here
          },
        },
      },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return undefined;

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    return dbUser?.id;
  } catch {
    return undefined;
  }
}
