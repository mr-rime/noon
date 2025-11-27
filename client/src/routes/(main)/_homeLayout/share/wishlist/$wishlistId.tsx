import { useQuery } from '@apollo/client';
import { GET_PUBLIC_WISHLIST } from '@/graphql/wishlist';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/product-card';
import { createFileRoute } from '@tanstack/react-router';
import { useMemo } from 'react';
import { Heart } from 'lucide-react';

export const Route = createFileRoute('/(main)/_homeLayout/share/wishlist/$wishlistId')({
  component: PublicWishlistShare,
})

function PublicWishlistShare() {
  const { wishlistId } = Route.useParams();

  const { data, loading, error } = useQuery(GET_PUBLIC_WISHLIST, {
    variables: { wishlist_id: wishlistId },
    fetchPolicy: 'no-cache',
  });

  const wishlistData = useMemo(() => data?.getPublicWishlist?.data, [data]);
  const items = useMemo(() => wishlistData?.items ?? [], [wishlistData]);

  return (
    <main className="site-container mt-4 sm:mt-8 min-h-screen w-full px-3 sm:px-6 lg:px-[45px] py-4">
      <section className="rounded-2xl border border-[#EAECF0] bg-white p-4 sm:p-6 shadow-sm">
        {/* Header */}
        {loading ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : wishlistData ? (
          <div>
            <div className="flex items-center gap-2 text-[#3866df] text-sm font-semibold uppercase">
              <Heart size={16} /> Shared Wishlist
            </div>
            <h1 className="text-2xl font-extrabold text-[#1f2024] mt-1">
              {wishlistData.name}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {items.length || 0} item{items.length === 1 ? '' : 's'}
            </p>
          </div>
        ) : null}

        {/* Content */}
        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-[300px] w-full rounded-md" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-dashed border-[#EAECF0] bg-white px-6 py-10 text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                {error.message || 'This wishlist could not be found.'}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#EAECF0] bg-white px-6 py-10 text-center">
              <p className="text-gray-500 text-sm sm:text-base">
                This wishlist is empty.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item: any) => (
                <ProductCard key={item.id} product={item.product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
