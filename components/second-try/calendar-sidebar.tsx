import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus } from "lucide-react"

export function CalendarSidebar() {
  const calendars = [
    { name: "Personal", color: "bg-blue-500" },
    { name: "Work", color: "bg-green-500" },
    { name: "Family", color: "bg-red-500" },
  ]

  return (
    <aside className="w-64 border-r p-4 flex flex-col">
      <Button className="mb-4">
        <Plus className="mr-2 h-4 w-4" /> Create
      </Button>
      <ScrollArea className="flex-1">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">My calendars</h2>
            <ul className="space-y-2">
              {calendars.map((calendar) => (
                <li key={calendar.name} className="flex items-center">
                  <span className={`w-3 h-3 rounded-full ${calendar.color} mr-2`}></span>
                  <span>{calendar.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}

