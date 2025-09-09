// filepath: d:\KKN\webdesa\frontend\src\components\posts\RelatedPosts.tsx
import { Post } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

interface RelatedPostsProps {
  posts: Post[];
  currentPostId: string;
}

export default function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  const relatedPosts = posts
    .filter(post => post.id !== currentPostId)
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="mt-12 border-t border-gray-200 pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Artikel Terkait</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.slug}`}
            className="group"
          >
            <article className="space-y-3">
              <div className="relative h-48 overflow-hidden rounded-lg">
                <Image
                  src={post.featuredImage || '/images/placeholder.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div>
                <span className="text-xs text-primary-600 font-medium">
                  {post.category}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  );
}