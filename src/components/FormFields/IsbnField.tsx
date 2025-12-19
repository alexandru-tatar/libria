import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface IsbnFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

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
        pattern: {
          value: /^97[89]-\d-\d{3}-\d{5}-\d$/,
          message: "Ungültiges ISBN-13 Format (978-X-XXX-XXXXX-X)",
        },
        minLength: { value: 17, message: "ISBN-13 muss 17 Zeichen lang sein (inkl. Bindestriche)" },
        maxLength: { value: 17, message: "ISBN-13 muss 17 Zeichen lang sein (inkl. Bindestriche)" },
      }}
    />
  );
}
