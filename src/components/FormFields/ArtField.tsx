import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface ArtFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

const ART_OPTIONS = [
  { value: "EPUB", label: "EPUB" },
  { value: "HARDCOVER", label: "Hardcover" },
  { value: "PAPERBACK", label: "Paperback" },
];

export function ArtField<T extends FieldValues>({ name, control, errors }: ArtFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Art (optional)"
      select
      options={ART_OPTIONS}
      placeholder="Wähle eine Art"
      rules={{
        validate: (value?: string) =>
          !value || ART_OPTIONS.some(opt => opt.value === value) || "Ungültige Art",
      }}
    />
  );
}
