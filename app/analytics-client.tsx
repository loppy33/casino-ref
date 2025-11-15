// app/analytics-client.tsx
'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
    interface Window { gtag?: (...args: any[]) => void }
}

export default function AnalyticsClient({ gaId }: { gaId?: string }) {
    const pathname = usePathname()

    useEffect(() => {
        // Не вызывать если gtag ещё не инициализирован
        if (!window.gtag) return

        // Отправляем page_view при первой загрузке и при каждой смене маршрута
        window.gtag('event', 'page_view', {
            page_path: pathname,
            page_location: window.location.href,
            page_title: document.title,
        })
    }, [pathname])

    return null
}
