import * as React from "react";
import { cn } from "@/lib/utils";
import { LoaderCircle, Spline } from "lucide-react";

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

interface SearchableDropdownProps extends Omit<React.ComponentProps<"input">, "onSelect"> {
  fetchItems: (query: string) => Promise<any[]>; // API call function
  onSelect: (item: any) => void;
  displayKey?: string; // which key of result to display, default = "name"
}

const SearchableDropdown = React.forwardRef<HTMLInputElement, SearchableDropdownProps>(
  ({ className, fetchItems, onSelect, displayKey = "name", ...props }, ref) => {
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [selected, setSelected] = React.useState(null);


    const search = React.useCallback(
      debounce(async (q: string) => {
         if (selected && q !== selected[displayKey]) {
           setSelected(null);
         }
  
        if (q.length >= 3) {
          setLoading(true);
          try {
            const data = await fetchItems(q);
            setResults(data);
            setShowDropdown(true);
          } finally {
            setLoading(false);
          }
        } else {
          setResults([]);
          setShowDropdown(false);
        }
      }, 400),
      [fetchItems]
    );

    React.useEffect(() => {
      search(query);
    }, [query, search]);


    const onSelectIten = (item:any)=>{
      setSelected(item);
      onSelect(item)
    }

    React.useEffect(() => {
      if(selected) setShowDropdown(false);
    }, [selected]);


    return (
      <div className="relative w-full my-3 mx-2">
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          {...props}
        />

        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2 mr-4">
            <LoaderCircle className="h-5 w-5 text-gray-500 animate-spin" />
          </div>
        )}

        {showDropdown && (
          <div className="absolute w-full z-50 mt-1 rounded-md border border-border bg-background shadow-md max-h-60 overflow-y-auto">
            {!loading && !selected && results.length === 0 && <div className="p-2 mt-1 text-muted-foreground">No results found</div>}
            {results.map((item, index) => (
              <div
                key={index}
                className="px-4 py-2 cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground"
                onClick={() => {
                  setShowDropdown(false);
                  setQuery(item[displayKey] ?? "");
                  setResults([]);
                  onSelectIten(item);
                }}
              >
                {item[displayKey] ?? JSON.stringify(item)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchableDropdown.displayName = "SearchableDropdown";

export { SearchableDropdown };
