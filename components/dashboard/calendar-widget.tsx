"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CalendarSnapshot() {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    // Mock dates with scheduled visits
    const scheduledDates = [
        new Date(2026, 2, 10),
        new Date(2026, 2, 12),
        new Date(2026, 2, 13),
        new Date(2026, 2, 14),
        new Date(2026, 2, 15),
        new Date(2026, 2, 18),
    ]

    return (
        <Card className="shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Calendar Snapshot</CardTitle>
                <CardDescription>Upcoming scheduled visits</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="relative w-full h-full rounded-none border-0"
                    classNames={{
                        root: "relative w-full h-full p-4 !max-w-none flex flex-col",
                        months: "w-full h-full !max-w-none flex flex-col flex-1",
                        month: "w-full h-full !max-w-none flex flex-col flex-1",
                        table: "w-full border-separate border-spacing-y-0 border-spacing-x-2 !table-fixed flex-1",
                        nav: "absolute inset-x-4 top-4 h-10 flex items-center justify-between pointer-events-none z-20",
                        button_previous: "pointer-events-auto bg-background/50 hover:bg-background/80 !opacity-100",
                        button_next: "pointer-events-auto bg-background/50 hover:bg-background/80 !opacity-100",
                        month_caption: "flex items-center justify-center h-10 w-full mb-2",
                        caption_label: "font-bold text-base inline-flex items-center justify-center",
                        weekday: "text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] h-8 flex items-center justify-center",
                        day: "relative h-12 w-full text-center text-sm p-0 focus-within:z-20 flex-1 flex items-center justify-center !aspect-auto rounded-md",
                        row: "w-full",
                        selected: "!bg-black !text-white hover:!bg-black hover:!text-white focus:!bg-black focus:!text-white",
                    }}
                    components={{
                        DayButton: ({ className, ...props }) => (
                            <button
                                {...props}
                                className={`w-full h-full flex items-center justify-center transition-colors rounded-md hover:bg-accent hover:text-accent-foreground aria-selected:!bg-black aria-selected:!text-white ${className}`}
                            />
                        )
                    }}
                    modifiers={{
                        scheduled: scheduledDates,
                    }}
                    modifiersStyles={{
                        scheduled: { fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary)', scale: '1.05' }
                    }}
                />
            </CardContent>
        </Card>
    )
}
