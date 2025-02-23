// components/ui/empty-placeholder.tsx
import { Icon } from "iconsax-react";
import { LucideIcon } from "lucide-react";

interface EmptyPlaceholderProps {
  icon: Icon;
  title: string;
  description: string;
}

export const EmptyPlaceholder = ({
  icon: Icon,
  title,
  description,
}: EmptyPlaceholderProps) => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="rounded-full bg-gray-100 p-3">
      <Icon className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="mt-4 text-lg font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-gray-500">{description}</p>
  </div>
);
