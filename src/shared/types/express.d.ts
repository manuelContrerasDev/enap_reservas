import "@prisma/client";

declare global {
  namespace Express {
    interface UserJwt {
      sub: string;
      email: string;
      role: "ADMIN" | "SOCIO" | "EXTERNO";
      name?: string;
    }

    interface Request {
      user?: UserJwt;
    }
  }
}
