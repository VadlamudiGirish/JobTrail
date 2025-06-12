import { NextRequest, NextResponse } from "next/server";

const PUBLIC_LOCALES = ["en", "de"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/en", request.url));
  }

  const pathLocale = pathname.split("/")[1];
  if (!PUBLIC_LOCALES.includes(pathLocale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  return NextResponse.next();
}
