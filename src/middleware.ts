import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
// import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    // const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const url = req.nextUrl.clone();
    const splitPath = url.pathname.split("/");
    const mainPage = "/en";

    if (url.pathname === "/") {
        url.pathname = mainPage;
        return NextResponse.redirect(url);
    }

    if (splitPath[2] && splitPath[2] !== "xo") {
        url.pathname = `/${splitPath[1]}/xo`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/th/:path*", "/en/:path*"],
};
