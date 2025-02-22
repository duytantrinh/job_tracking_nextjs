import {Control} from "react-hook-form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {Input} from "./ui/input"

type CustomFormFieldProp = {
  name: string
  control: Control<any>
}

export function CustomFormField({name, control}: CustomFormFieldProp) {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem>
          <FormLabel className="capitalize">{name}</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type CustomFormSelectProp = {
  name: string
  control: Control<any>
  items: string[]
  labelText?: string
}

export function CustomFormSelect({
  name,
  control,
  items,
  labelText,
}: CustomFormSelectProp) {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem>
          <FormLabel className="capitalize">{labelText || name}</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {items.map((item) => {
                return (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
