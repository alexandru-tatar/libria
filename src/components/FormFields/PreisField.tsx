import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface PreisFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function PreisField<T extends FieldValues>({ name, control, errors }: PreisFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Preis"
      type="number"
      rules={{
        required: "Preis ist erforderlich",
        min: { value: 0, message: "Preis muss positiv sein" },
        max: { value: 99999999.99, message: "Maximal 8 Stellen, 2 Nachkommastellen" },
        validate: value =>
          /^\d{1,6}(\.\d{1,2})?$/.test(String(value)) || "Maximal 8 Stellen, 2 Nachkommastellen",
      }}
    />
  );
}
