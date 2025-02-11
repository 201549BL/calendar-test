import { DateTimePicker } from "@/components/form/date-time-picker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getRandomPractitioner } from "@/lib/mock-calendar-two";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EVENT_TYPES } from "../constants/constants";
import { useCalendarContext } from "../context/CalendarContext";
import type { EventType } from "../types/types";

const formSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    start: z.date(),
    end: z.date(),
    eventType: z.enum(EVENT_TYPES),
  })
  .refine((data) => data.end > data.start, {
    message: "End time must be after start time",
    path: ["end"],
  });

type FormValues = z.infer<typeof formSchema>;

export const EventFormDialog = () => {
  const { dialogState, closeDialog, setEvents } = useCalendarContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      start: new Date(),
      end: new Date(),
      eventType: "treatment",
    },
  });

  useEffect(() => {
    if (dialogState.isOpen && dialogState.initialData) {
      reset({
        title: dialogState.initialData.title || "",
        start: dialogState.initialData.start,
        end: dialogState.initialData.end,
        eventType: dialogState.initialData.eventType || "treatment",
      });
    }
  }, [dialogState, reset]);

  const onSubmit =  (data: FormValues) => {



    if (dialogState.mode === "edit" && dialogState.initialData?.id) {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === dialogState.initialData?.id
            ? {
                ...event,
                title: data.title,
                start: data.start,
                end: data.end,
                type: data.eventType,
              }
            : event
        )
      );
    } else {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: `temp-${Date.now()}`,
          title: data.title,
          start: data.start,
          end: data.end,
          type: data.eventType,
          practitioner: getRandomPractitioner(),
        },
      ]);
    }

    closeDialog();
    reset();
  };

  const deleteAppointment = () => {
    setEvents((prev) =>
      prev.filter(
        (event) => event.id !== dialogState.initialData?.id
      )
    )

    closeDialog()
  }

  return (
    <Dialog open={dialogState.isOpen} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>
              {dialogState.mode === "edit" ? "Edit Event" : "New Event"}
            </DialogTitle>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input {...register("title")} id="title" />
                {errors.title && (
                  <span className="text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="start">Start</Label>
                <DateTimePicker
                  field={{
                    value: getValues("start").toISOString(),
                    onChange: (value) => setValue("start", new Date(value)),
                  }}
                />
                {errors.start && (
                  <span className="text-sm text-red-500">
                    {errors.start.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="end">End</Label>
                <DateTimePicker
                  field={{
                    value: getValues("end").toISOString(),
                    onChange: (value) => setValue("end", new Date(value)),
                  }}
                />
                {errors.end && (
                  <span className="text-sm text-red-500">
                    {errors.end.message}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="eventType">Event Type</Label>
                <Select
                  onValueChange={(value: EventType) =>
                    setValue("eventType", value)
                  }
                  defaultValue={getValues("eventType")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="time off">Time Off</SelectItem>
                  </SelectContent>
                </Select>
                {errors.eventType && (
                  <span className="text-sm text-red-500">
                    {errors.eventType.message}
                  </span>
                )}
              </div>
            </div>
          </DialogHeader>
          <DialogFooter className="mt-4">
            {dialogState.mode === "edit" && (
              <Button
                variant="destructive"
                type="button"
                onClick={ deleteAppointment }
                disabled={isSubmitting}
              >
                Delete
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {dialogState.mode === "edit" ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
