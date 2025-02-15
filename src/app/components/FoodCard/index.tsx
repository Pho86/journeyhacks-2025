import Link from 'next/link';
import Image from 'next/image';
import { FoodImage } from '@/utils/types';

interface FoodCardProps {
  food: FoodImage;
}

export default function FoodCard({ food }: FoodCardProps) {
  return (
    <Link href={`/recipe/${food.id}`} key={food.id} className="group hover:bg-zinc-50 transition-all rounded-lg shadow-md p-3">
      {food.imageUrl && (
        <Image
          src={food.imageUrl}
          width={300}
          height={300}
          alt={food.title}
          className="w-full h-72 object-cover rounded-lg"
        />
      )}
      <h3 className="mt-2 text-xl group-hover:font-semibold transition-all">{food.title}</h3>
    </Link>
  );
}