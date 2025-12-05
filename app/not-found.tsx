'use client'

import Link from 'next/link'

export default function NotFound() {
    return (
        <div className='container NotFoundPage'>
            <h1>404</h1>
            <p >
                Page introuvable. Vous avez peut-être suivi le mauvais lien.
            </p>
            <Link
                href="/"
                className='btn btn--primary'
            >
                Retour à l'accueil
            </Link>
        </div>
    )
}