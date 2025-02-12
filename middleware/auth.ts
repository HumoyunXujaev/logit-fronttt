import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, extractToken } from '@/lib/jwt';
import { AuthenticationError, AuthorizationError } from '@/lib/errors';

export async function authenticateRequest(
  request: NextRequest,
  allowedRoles?: string[]
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = extractToken(authHeader);
    const payload = verifyToken(token);

    if (allowedRoles && !allowedRoles.includes(payload.role)) {
      throw new AuthorizationError();
    }

    return payload;
  } catch (error) {
    if (error instanceof AuthorizationError) {
      throw error;
    }
    throw new AuthenticationError();
  }
}

export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async function (request: NextRequest, ...args: any[]) {
    try {
      const payload = await authenticateRequest(request, allowedRoles);
      return handler(request, payload, ...args);
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof AuthorizationError
      ) {
        return NextResponse.json(
          { error: error.message },
          { status: error.statusCode }
        );
      }
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
