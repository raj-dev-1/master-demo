import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./utils/jwtUtils";
const privateRoutes: Record<string, string[]> = {
  student: [
    "/",
    "/calendar",
    "/profile",
    "/leaves",
    "/settings",
  ],
  hod: [
    "/",
    "/calendar",
    "/profile",
    "/leaves",
    "/settings",
  ],
  faculty: ["/dashboard", "/profile", "/manager"],
  admin: [
  "/",
  "/calendar",
  "/profile",
  "/leaves",
  "/settings",
  ]
};
const publicRoutes = [
  "/user/login",
  "/user/register",
  "/user/forgetPassword",
  "/user/verifyOtp",
  "/user/resetPassword",
];

export default async function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt")?.value;

  const nextUrlPath = req.nextUrl.pathname;
  // Bypass specific routes
  if (nextUrlPath.startsWith("/_next/") || nextUrlPath.startsWith("/.next/")) {
    return NextResponse.next();
  }
  // Redirect unauthenticated users trying to access private routes
  if (
    !token &&
    privateRoutes.student.concat(privateRoutes.faculty).concat(privateRoutes.admin).includes(nextUrlPath)
  ) {
    const loginURL = new URL("/user/login", req.nextUrl.origin);
    return NextResponse.redirect(loginURL.toString());
  }
  if (token) {
    try {
      const secretKey = process.env.SECRETKEY;
      if (!secretKey) throw new Error("Secret key is not defined");

      const payload = await verifyToken(token, secretKey);
      const role = payload.userDetails.role;

      const userPrivateRoutes = privateRoutes[role] || [];
      const nextUrlPath = req.nextUrl.pathname;

      // Redirect authenticated users away from public routes
      if (publicRoutes.includes(nextUrlPath)) {
        const dashboardURL = new URL(userPrivateRoutes[0], req.nextUrl.origin);
        return NextResponse.redirect(dashboardURL.toString());
      }

      // Ensure users only access their allowed routes
      if (!userPrivateRoutes.includes(nextUrlPath)) {
        const defaultPrivateRoute = userPrivateRoutes[0] || '/';
        const defaultURL = new URL(defaultPrivateRoute, req.nextUrl.origin);
        return NextResponse.redirect(defaultURL.toString());
      }

      return NextResponse.next();

    } catch (error) {
      console.error("Token verification failed:", error);
      const response = NextResponse.redirect(new URL("/user/login", req.nextUrl.origin));
      response.cookies.delete('jwt');
      return response;
      
    }
  }
  // // Default response
  return NextResponse.next();
}
