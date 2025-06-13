import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token }) {
        return !!token;
      },
    },
    pages: {
      signIn: "/en/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|en/login).*)"],
};
