import { createServerClient } from "@supabase/ssr";import { createServerClient } from "@supabase/ssr";

import { NextResponse, type NextRequest } from "next/server";import { NextResponse, type NextRequest } from "next/server";



export async function middleware(request: NextRequest) {export async function middleware(request: NextRequest) {

  // Only protect admin routes  // Only protect admin routes

  if (!request.nextUrl.pathname.startsWith("/admin")) {  if (!request.nextUrl.pathname.startsWith("/admin")) {

    return NextResponse.next();    return NextResponse.next();

  }  }



  // Always allow access to login page to prevent infinite redirects  // Always allow access to login page to prevent infinite redirects

  if (request.nextUrl.pathname === "/admin/login") {  if (request.nextUrl.pathname === "/admin/login") {

    return NextResponse.next();    return NextResponse.next();

  }  }



  let response = NextResponse.next({  let response = NextResponse.next({

    request: {    request: {

      headers: request.headers,      headers: request.headers,

    },    },

  });  });



  const supabase = createServerClient(  const supabase = createServerClient(

    process.env.NEXT_PUBLIC_SUPABASE_URL!,    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {    {

      cookies: {      cookies: {

        getAll() {        getAll() {

          return request.cookies.getAll();          return request.cookies.getAll();

        },        },

        setAll(cookiesToSet) {        setAll(cookiesToSet) {

          cookiesToSet.forEach(({ name, value, options }) => {          cookiesToSet.forEach(({ name, value, options }) => {

            response.cookies.set(name, value, options);            response.cookies.set(name, value, options);

          });          });

        },        },

      },      },

    }    }

  );  );



  try {  try {

    // Check if user is authenticated    // Check if user is authenticated

    const {    const {

      data: { user },      data: { user },

    } = await supabase.auth.getUser();    } = await supabase.auth.getUser();



    // If no user and trying to access protected admin route, redirect to login    // If no user and trying to access protected admin route, redirect to login

    if (!user) {    if (!user) {

      const redirectUrl = request.nextUrl.clone();      const redirectUrl = request.nextUrl.clone();

      redirectUrl.pathname = "/admin/login";      redirectUrl.pathname = "/admin/login";

      redirectUrl.search = `?redirectTo=${encodeURIComponent(request.nextUrl.pathname)}`;      redirectUrl.search = `?redirectTo=${encodeURIComponent(request.nextUrl.pathname)}`;

      return NextResponse.redirect(redirectUrl);      return NextResponse.redirect(redirectUrl);

    }    }



    // User is authenticated, allow access    // User is authenticated, allow access

    return response;    return response;

  } catch (error) {  } catch (error) {

    // If there's an error checking authentication, redirect to login    // If there's an error checking authentication, redirect to login

    const redirectUrl = request.nextUrl.clone();    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = "/admin/login";    redirectUrl.pathname = "/admin/login";

    return NextResponse.redirect(redirectUrl);    return NextResponse.redirect(redirectUrl);

  }  }

}}



export const config = {export const config = {

  matcher: ["/admin/:path*"],  matcher: ["/admin/:path*"],

};};eateServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Temporarily disabled to debug - just pass through all requests
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
