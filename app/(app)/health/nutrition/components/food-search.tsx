import { useState, useEffect } from "react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"

interface FoodSearchProps {
  onAddFood: (foodName: string) => void
}

export function FoodSearch({ onAddFood }: FoodSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [autocompleteResults, setAutocompleteResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchAutocomplete(searchQuery)
      } else {
        setAutocompleteResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const fetchAutocomplete = async (query: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, type: 'instant' }),
      });
      const data = await response.json();
      setAutocompleteResults(data.common?.slice(0, 10) || []);
    } catch (error) {
      console.error('Error fetching autocomplete data:', error);
      setAutocompleteResults([]); // Clear results on error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Search for a food..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandList>
        {loading && autocompleteResults.length === 0 && (
          <div className="p-4 text-sm text-center text-muted-foreground flex items-center justify-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Searching...
          </div>
        )}
        {!loading && searchQuery && autocompleteResults.length === 0 && (
          <CommandEmpty>No results found for &quot;{searchQuery}&quot;.</CommandEmpty>
        )}
        {!searchQuery && !loading && (
            <CommandEmpty>Start typing to search for foods...</CommandEmpty>
        )}
        <CommandGroup heading={autocompleteResults.length > 0 ? "Suggestions" : ""}>
          {autocompleteResults.map((result, index) => (
            <CommandItem
              key={index}
              value={result.food_name} // Important for Command behavior
              onSelect={() => {
                // onAddFood(result.food_name); // Optionally add directly on select, or let user click plus
                // setSearchQuery(""); // Clear search after adding
                // setAutocompleteResults([]);
              }}
              className="py-2 px-3 cursor-pointer hover:bg-accent focus:bg-accent"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-sm">{result.food_name}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent CommandItem's onSelect
                    onAddFood(result.food_name);
                    // setSearchQuery(""); // Clear search after adding
                    // setAutocompleteResults([]);
                  }}
                  aria-label={`Add ${result.food_name}`}
                >
                  <PlusCircle className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}