import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default function middleware(_request: NextRequest) {
  return NextResponse.next();
}

// export const config = {
//   // Match all pathnames except for
//   // - … if they start with `/_next`, `/_vercel` or `monitoring`
//   // - … the ones containing a dot (e.g. `favicon.ico`)
//   matcher: '/((?!_next|_vercel|monitoring|.*\\..*).*)',
//   runtime: 'nodejs',
// };
