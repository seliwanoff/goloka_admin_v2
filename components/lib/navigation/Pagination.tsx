import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";

interface PaginationProps {
  pagination: {
    current_page: number;
    per_page: number;
    total_items: number;
    total_pages: number;
  };
  onPageChange: (page: number) => void;
  onRowSizeChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  onRowSizeChange,
}) => {
  const { current_page, per_page, total_items, total_pages } = pagination;

  const getPageNumbers = () => {
    const pageGroupSize = 3;
    let startPage = Math.max(1, current_page - Math.floor(pageGroupSize / 2));
    const endPage = Math.min(total_pages, startPage + pageGroupSize - 1);

    if (endPage === total_pages) {
      startPage = Math.max(1, total_pages - pageGroupSize + 1);
    }

    return Array.from(
      { length: Math.min(pageGroupSize, endPage - startPage + 1) },
      (_, index) => startPage + index
    );
  };

  const visiblePages = getPageNumbers();

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="inline-flex items-center gap-5">
        <div className="hidden items-center gap-3 sm:inline-flex">
          <p>Rows per page </p>
          <Select
            value={per_page.toString()}
            onValueChange={(value) => {
              onRowSizeChange(Number(value));
              onPageChange(1);
            }}
          >
            <SelectTrigger className="h-7 w-auto gap-2 px-2 focus:border-main-100 focus-visible:ring-0 focus-visible:ring-offset-0">
              <SelectValue placeholder="Select rows per page" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Rows per page</SelectLabel>
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <span className="text-sm text-gray-600">
          Page {current_page} of {total_pages} ({total_items} items)
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
        >
          <span>
            <ArrowLeft2 size="20" />
          </span>
          Prev
        </Button>
        {visiblePages.map((page) => (
          <Button
            variant="outline"
            className={cn(
              "h-6 w-6 p-2 text-sm",
              page === current_page
                ? "bg-main-100 text-white hover:bg-blue-700 hover:text-white"
                : ""
            )}
            key={page}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="border-0 bg-transparent p-0 hover:bg-transparent hover:text-main-100"
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === total_pages}
        >
          Next{" "}
          <span>
            <ArrowRight2 size="20" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
