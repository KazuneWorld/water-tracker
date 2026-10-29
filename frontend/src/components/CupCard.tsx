import { Cup } from '@/types/cup';

interface CupCardProps {
  cup: Cup;
}

export function CupCard({ cup }: CupCardProps) {
  const isBottle = cup.type === 'bottle';

  return (
    <div className="border rounded-lg p-4 bg-white flex flex-col justify-between items-center text-center cursor-pointer hover:bg-slate-200 transition-all">
      {/* 容器名と容量 */}
      <h3 className="font-bold text-gray-800 text-base truncate w-full">
        {cup.name}
      </h3>
      <p className="text-gray-500 font-medium">{cup.capacity_ml} ml</p>

      {/* 容器タイプラベル */}
      <span
        className={`mt-3 text-xs px-2.5 py-1 rounded-full font-semibold ${
          isBottle ? 'bg-teal-200' : 'bg-blue-200'
        }`}
      >
        {isBottle ? '水筒 (1日1回)' : 'コップ (ワンタップ)'}
      </span>
    </div>
  );
}
