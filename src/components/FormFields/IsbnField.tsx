import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface IsbnFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export const isValidIsbn13 = (value: string): boolean => {
  const digits = value.replace(/[\s-]/g, '');
  if (!/^\d{13}$/.test(digits)) return false;

  const checksum = digits
    .slice(0, 12)
    .split('')
    .reduce((sum, d, i) => sum + Number(d) * (i % 2 === 0 ? 1 : 3), 0);

  return (10 - (checksum % 10)) % 10 === +digits[12];
};

export function IsbnField<T extends FieldValues>({ name, control, errors }: IsbnFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="ISBN-13"
      placeholder="978-0-007-00644-1"
      rules={{
        required: "ISBN ist erforderlich",
        validate: (value) => isValidIsbn13(String(value)) || "Ungültige ISBN-13",
      }}
    />
  );
}
