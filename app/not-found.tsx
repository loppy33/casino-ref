import Link from 'next/link';
import Bg from '@/components/Bg';
import { prisma } from '@/lib/db';

export default async function NotFound() {
    // 1. Делаем запрос к БД: 
    // Берем 2 категории, отсортированные по количеству казино (от большего к меньшему)
    const popularCategories = await prisma.category.findMany({
        orderBy: {
            casinos: {
                _count: 'desc',
            },
        },
        take: 2,
        select: {
            name: true,
            slug: true,
        },
    });

    return (
        <div className='NotFoundPage'>
            <Bg />
            
            <div className='container content'>
                <div className="error-code">404</div>
                
                <h1 className="title">
                    Oups ! Mauvais numéro...
                </h1>
                
                <p className="description">
                    On dirait que cette page a disparu ou que vous avez misé sur le mauvais lien. 
                    Pas de panique, la chance tourne !
                </p>

                <div className="actions">
                    <Link href="/" className='btn btn--primary'>
                        Retour à l'accueil
                    </Link>
                    
                    <Link href="/casinos" className='btn btn--ghost'>
                        Voir les Top Casinos
                    </Link>
                </div>

                <div className="suggestions">
                    <span>Ou essayez :</span>
                    <div className="links">
                        {/* 2. Динамически выводим популярные категории */}
                        {popularCategories.map((cat) => (
                            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
                                {cat.name}
                            </Link>
                        ))}
                        
                        {/* 3. Статичная ссылка на FAQ всегда полезна */}
                        <Link href="/faq">Aide & FAQ</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}