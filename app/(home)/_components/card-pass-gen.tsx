"use client";

import * as React from "react";

import { CharSetsCheckboxs } from "@/constants";
import { formGeneratorSchema, FormGeneratorSchemaType } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { MinusIcon, PlusIcon, RefreshCw } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export const CardPassGen = () => {
  const [passwordLength, setPasswordLength] = React.useState<number>(8);
  const [password, setPassword] = React.useState<string>("");

  const minPasswordLength = 1;
  const maxPasswordLength = 50;

  const form = useForm<FormGeneratorSchemaType>({
    resolver: zodResolver(formGeneratorSchema),
    defaultValues: {
      length: passwordLength,
      character_sets: CharSetsCheckboxs.map((item) => item.id),
    },
  });

  const generatePassword = React.useCallback(
    (length: number, selectedCharSets: string[]): string => {
      const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
      const numberChars = "0123456789";
      const symbolChars = "!@#$%^&*()_+[]{}|;:,.<>?";

      const availableChars = CharSetsCheckboxs.filter((set) =>
        selectedCharSets.includes(set.id)
      )
        .map((set) => set.id)
        .join("");

      let allCharacters = "";
      if (availableChars.includes("withUppercase"))
        allCharacters += uppercaseChars;
      if (availableChars.includes("withLowercase"))
        allCharacters += lowercaseChars;
      if (availableChars.includes("withNumbers")) allCharacters += numberChars;
      if (availableChars.includes("withSymbols")) allCharacters += symbolChars;

      let generatedPassword = "";
      for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * allCharacters.length);
        generatedPassword += allCharacters[randomIndex];
      }

      return generatedPassword;
    },
    []
  );

  const onSubmitGenerator = (values: FormGeneratorSchemaType) => {
    const newPassword = generatePassword(values.length, values.character_sets);
    setPassword(newPassword);
    // console.log("Generated password:", newPassword);
  };

  // Automatically regenerate the password when length or char sets change
  React.useEffect(() => {
    const { length, character_sets } = form.getValues();
    const newPassword = generatePassword(length, character_sets);
    setPassword(newPassword);
  }, [passwordLength, generatePassword, form]);

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
            <div className="relative h-14 w-full rounded-lg">
              <div className="flex h-full w-full items-center justify-center space-x-2">
                <div className="relative flex-grow">
                  <Input
                    type="text"
                    value={password}
                    readOnly
                    className="truncate pr-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {/* <Badge variant="secondary" className="bg-green-500 text-white mr-2">
              Very strong
            </Badge> */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {}}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  onClick={() => {}}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Copy
                </Button>
              </div>
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
                              <FormLabel className="cursor-pointer font-normal">
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
