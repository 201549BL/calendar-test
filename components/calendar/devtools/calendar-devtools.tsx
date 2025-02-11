import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import React from "react";
import { useCalendarContext } from "../calendar-context";

const CalendarDevtools = () => {
  const { events } = useCalendarContext();

  return (
    <Drawer>
      <DrawerTrigger>Open devtools</DrawerTrigger>
      <DrawerContent className="">
        <DrawerHeader>
          <DrawerTitle>Calendar data view</DrawerTitle>
        </DrawerHeader>
        <div className="h-96 overflow-y-auto p-4">
          {JSON.stringify(events, null, 2)}
        </div>
        <DrawerFooter>
          <DrawerClose>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default CalendarDevtools;
