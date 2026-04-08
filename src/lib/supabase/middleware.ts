import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  // If env vars are missing, skip auth check
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes - redirect to login if not authenticated
    const protectedPaths = [
      "/profile",
      "/purchases",
      "/sales",
      "/wallet",
      "/settings",
      "/messages",
      "/notifications",
      "/favorites",
      "/my-products",
      "/sell",
      "/checkout",
      "/earnings",
      "/disputes",
      "/tracking",
      "/coupons",
      "/payout-settings",
      "/open-dispute",
    ];

    const isProtected = protectedPaths.some((path) =>
      request.nextUrl.pathname.startsWith(path)
    );

    if (isProtected && !user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Redirect logged-in users away from auth pages
    const authPaths = ["/login", "/register"];
    if (authPaths.includes(request.nextUrl.pathname) && user) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return supabaseResponse;
  } catch {
    // If Supabase auth fails, allow the request through
    return NextResponse.next({ request });
  }
}
