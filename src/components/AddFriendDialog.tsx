"use client"
import { z } from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { Button } from "./ui/button"
import { UserPlus } from "lucide-react"
import { Field, FieldError, FieldGroup, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import { LoadingSwap } from "./ui/loading-swap"
import { useState } from "react"
import { toast } from "sonner"
import { sendFriendRequest } from "../services/supabase/actions/friends"
import { useRouter } from "next/navigation"

const formShema = z.object({
  username: z.string().min(1, { message: "Username must be greater than 1 character" }).trim(),
})

const AddFriendDialog = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formShema>>({
    resolver: zodResolver(formShema),
    defaultValues: {
      username: ""
    }
  })

  async function onsubmit(data: z.infer<typeof formShema>) {
    const response = await sendFriendRequest(data.username)
    if (response.success) {
      toast.success(response.data.message)
      setOpen(false)
      router.refresh()
    } else {
      toast.error(response.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>

            <Button size="icon" variant="outline">
              <UserPlus />
            </Button>
          </DialogTrigger>

        </TooltipTrigger>
        <TooltipContent><p>Add Friend</p></TooltipContent>
      </Tooltip>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add Friend
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Enter the username of the person you want to send friend request
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onsubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    {...field}
                    id="username"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Field orientation="horizontal" className="w-full flex flex-col sm:flex-row">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full sm:grow sm:w-auto"
              >
                <LoadingSwap isLoading={form.formState.isSubmitting}>
                  Send Request
                </LoadingSwap>
              </Button>
              <Button
                variant="outline"
                type="button"
                className="w-full sm:grow sm:w-auto"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriendDialog
