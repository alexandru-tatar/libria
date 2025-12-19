import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface HomepageFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function HomepageField<T extends FieldValues>({ name, control, errors }: HomepageFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Homepage (optional)"
      type="url"
      rules={{
        validate: value => !value || /^https?:\/\/.+/.test(String(value)) || "Ungültige URL",
      }}
    />
  );
}
