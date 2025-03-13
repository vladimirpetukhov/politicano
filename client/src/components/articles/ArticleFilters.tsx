import { useState } from "react";
import { useDispatch } from "react-redux";
import { setFilters } from "@/store/slices/articleSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";

export function ArticleFilters() {
  const dispatch = useDispatch();
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  const handleFilter = () => {
    dispatch(
      setFilters({
        author: author || null,
        dateRange: {
          start: date ? date.toISOString() : null,
          end: null,
        },
      })
    );
  };

  return (
    <div className="flex gap-4 mb-8">
      <Input
        placeholder="Filter by author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">
            {date ? format(date, "MMM d, yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      <Button onClick={handleFilter}>Apply Filters</Button>
    </div>
  );
}