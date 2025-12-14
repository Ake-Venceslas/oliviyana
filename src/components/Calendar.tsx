"use client"

import * as React from "react"
import { useSidebar } from "@/components/SidebarProvider";
import { Calendar } from "@/components/ui/calendar"

export function CalendarCn() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const { expanded, setExpanded } = useSidebar();

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className={`rounded-md transition-all duration-300 ease-in-out bg-gray-100 ${expanded ? "w-full" : "w-full"}`}
      captionLayout="dropdown"
    />
  )
}
