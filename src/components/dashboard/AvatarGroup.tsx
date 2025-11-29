'use client';

export type AvatarGroupProps = {
  avatars: string[];
  maxDisplay?: number;
  size?: 'sm' | 'md' | 'lg';
};

export function AvatarGroup({ avatars, maxDisplay = 5, size = 'md' }: AvatarGroupProps) {
  const displayedAvatars = avatars.slice(0, maxDisplay);
  const remainingCount = avatars.length - maxDisplay;

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  return (
    <div className="flex items-center -space-x-2">
      {displayedAvatars.map((avatar, index) => (
        <div
          key={index}
          className={`relative overflow-hidden rounded-full border-2 border-white ${sizeClasses[size]}`}
        >
          <img
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className={`flex items-center justify-center rounded-full border-2 border-white bg-gray-200 ${sizeClasses[size]}`}
        >
          <span className="font-semibold text-gray-600">
            +
            {remainingCount}
          </span>
        </div>
      )}
    </div>
  );
}

