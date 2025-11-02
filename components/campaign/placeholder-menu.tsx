"use client"

import { useState, useMemo } from "react"
import { ChevronDown, Hash, Search, User, Calendar, Settings, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { PlaceholderGroup } from "./workflow-types"

interface PlaceholderMenuProps {
  groups: PlaceholderGroup[]
  onInsert: (placeholder: string) => void
  disabled?: boolean
  triggerLabel?: string
  className?: string
}

const GROUP_ICONS: Record<string, any> = {
  contact: User,
  campaign: Hash,
  system: Settings,
  context: Settings,
  inputs: Link,
  previous: Link,
}

export function PlaceholderMenu({
  groups,
  onInsert,
  disabled = false,
  triggerLabel = "Insert variable",
  className,
}: PlaceholderMenuProps) {
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const filteredGroups = useMemo(() => {
    if (!search) return groups

    const lowerSearch = search.toLowerCase()
    return groups
      .map(group => ({
        ...group,
        options: group.options.filter(
          option =>
            option.label.toLowerCase().includes(lowerSearch) ||
            option.id.toLowerCase().includes(lowerSearch) ||
            option.description?.toLowerCase().includes(lowerSearch)
        ),
      }))
      .filter(group => group.options.length > 0)
  }, [groups, search])

  const handleSelect = (placeholder: string) => {
    onInsert(placeholder)
    setOpen(false)
    setSearch("")
  }

  if (!groups.length) {
    return null
  }

  // If we have a simple structure with few options, use a simple dropdown
  const totalOptions = groups.reduce((acc, group) => acc + group.options.length, 0)
  const useSimpleMenu = totalOptions <= 15 && groups.length <= 3

  if (useSimpleMenu) {
    return (
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={disabled}
            className={cn("h-7 text-xs", className)}
          >
            {triggerLabel}
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[320px]">
          <div className="px-2 py-1.5">
            <Input
              placeholder="Search variables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredGroups.map((group, groupIndex) => {
              const IconComponent = GROUP_ICONS[group.id] || Hash
              return (
                <div key={group.id}>
                  {groupIndex > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    <IconComponent className="mr-1 inline h-3 w-3" />
                    {group.label}
                  </DropdownMenuLabel>
                  {group.options.map((option) => (
                    <DropdownMenuItem
                      key={option.id}
                      onClick={() => handleSelect(option.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <code className="text-xs font-mono text-primary">
                            {option.id}
                          </code>
                        </div>
                        {option.description && (
                          <div className="text-xs text-muted-foreground">
                            {option.description}
                          </div>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </div>
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // For complex structures, use sub-menus
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          className={cn("h-7 text-xs", className)}
        >
          {triggerLabel}
          <ChevronDown className="ml-1 h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {groups.map((group) => {
          const IconComponent = GROUP_ICONS[group.id] || Hash
          return (
            <DropdownMenuSub key={group.id}>
              <DropdownMenuSubTrigger>
                <IconComponent className="mr-2 h-4 w-4" />
                <span className="text-sm">{group.label}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {group.options.length}
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="max-h-[400px] w-[320px] overflow-y-auto">
                <div className="sticky top-0 bg-popover px-2 pb-2 pt-1">
                  <Input
                    placeholder="Search in group..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                {(search
                  ? group.options.filter(
                      (option) =>
                        option.label.toLowerCase().includes(search.toLowerCase()) ||
                        option.id.toLowerCase().includes(search.toLowerCase())
                    )
                  : group.options
                ).map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                      <code className="text-xs font-mono text-primary">
                        {option.id}
                      </code>
                      {option.description && (
                        <div className="text-xs text-muted-foreground">
                          {option.description}
                        </div>
                      )}
                      {option.example && (
                        <div className="text-xs text-muted-foreground">
                          Example: {option.example}
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
