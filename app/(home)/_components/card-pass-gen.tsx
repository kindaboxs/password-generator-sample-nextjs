"use client";

import * as React from "react";

import { CharSetsCheckboxs } from "@/constants";
import { formGeneratorSchema, FormGeneratorSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";

export const CardPassGen = () => {
  const [passwordLength, setPasswordLength] = React.useState<number>(8);
  // const [password, setPassword] = React.useState<string>("");

  const minPasswordLength = 1;
  const maxPasswordLength = 50;

  const form = useForm<FormGeneratorSchemaType>({
    resolver: zodResolver(formGeneratorSchema),
    defaultValues: {
      length: passwordLength,
      character_sets: CharSetsCheckboxs.map((item) => item.id),
    },
  });

  const onSubmitGenerator = (values: FormGeneratorSchemaType) => {
    console.log("Generated values:", values);
  };

  return (
    <Card className="w-full max-w-md bg-foreground/5">
      {/* header card */}
      <CardHeader className="text-center">
        <CardTitle>Generate Password</CardTitle>
        <CardDescription>
          Create a new password using the options below.
        </CardDescription>
      </CardHeader>

      {/* main content card */}
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitGenerator)}
            className="space-y-6"
          >
            <div className="relative h-14 w-full overflow-hidden rounded-lg border border-border bg-background">
              <p className="absolute inset-0 flex items-center pl-3">
                password generated
              </p>
            </div>

            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem className="flex w-full flex-col items-center justify-center space-y-4">
                  <FormLabel className="font-normal text-muted-foreground">
                    Length:{" "}
                    <span className="font-bold text-foreground">
                      {field.value}
                    </span>
                  </FormLabel>

                  <div className="flex flex-row items-center justify-between gap-x-4">
                    <Button
                      size="icon"
                      onClick={() => {
                        if (passwordLength > minPasswordLength) {
                          setPasswordLength(passwordLength - 1);
                          field.onChange(passwordLength - 1);
                        }
                      }}
                      disabled={passwordLength <= minPasswordLength}
                    >
                      <MinusIcon className="size-5" />
                    </Button>
                    <Slider
                      name="length"
                      value={[field.value]}
                      defaultValue={[field.value]}
                      max={maxPasswordLength}
                      min={minPasswordLength}
                      step={1}
                      className="w-[250px]"
                      onValueChange={(value) => {
                        setPasswordLength(value[0]);
                        field.onChange(value[0]);
                        form.handleSubmit(onSubmitGenerator)();
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={() => {
                        if (passwordLength < maxPasswordLength) {
                          setPasswordLength(passwordLength + 1);
                          field.onChange(passwordLength + 1);
                        }
                      }}
                      disabled={passwordLength >= maxPasswordLength}
                    >
                      <PlusIcon className="size-5" />
                    </Button>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="character_sets"
              render={() => (
                <FormItem className="flex w-full flex-col items-center justify-center space-y-4">
                  <div className="mb-4 text-center">
                    <FormLabel className="text-base">Character Used:</FormLabel>
                    <FormDescription>
                      Select the character sets you want to use.
                    </FormDescription>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    {CharSetsCheckboxs.map((item) => (
                      <FormField
                        key={item.id}
                        control={form.control}
                        name="character_sets"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item.id)}
                                  onCheckedChange={(checked) => {
                                    return (
                                      checked
                                        ? field.onChange([
                                            ...field.value,
                                            item.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item.id
                                            )
                                          ),
                                      form.handleSubmit(onSubmitGenerator)()
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {item.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
