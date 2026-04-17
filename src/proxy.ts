import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy - Replaces the deprecated middleware convention.
 * Acts as a network boundary for URL rewrites and multi-tenancy.
 */
export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const hostname = request.headers.get('host') || ''

  // 1. Détecter si on est sur un sous-domaine (ex: marie.localhost:3000)
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || 'localhost:3000'
  
  if (hostname === baseDomain) {
    return NextResponse.next()
  }

  if (hostname.endsWith(`.${baseDomain}`)) {
    const slug = hostname.replace(`.${baseDomain}`, '')
    
    if (slug === 'www' || slug === 'admin') {
      return NextResponse.next()
    }

    const searchParams = url.searchParams.toString()
    const path = `${url.pathname}${searchParams.length > 0 ? `?${searchParams}` : ''}`
    
    if (url.pathname.startsWith(`/${slug}`)) {
        return NextResponse.next()
    }

    return NextResponse.rewrite(new URL(`/${slug}${path}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
