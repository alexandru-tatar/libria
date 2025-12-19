import type { FieldValues, Control, FieldErrors, Path } from "react-hook-form";
import { GenericField } from "./GenericField";

interface RabattFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function RabattField<T extends FieldValues>({ name, control, errors }: RabattFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Rabatt (optional)"
      type="number"
      rules={{
        min: { value: 0, message: "Rabatt muss positiv sein" },
        max: { value: 1, message: "Rabatt muss kleiner 1 sein" },
        validate: value =>
          /^\d{1}(\.\d{1,3})?$/.test(String(value)) || "Maximal 4 Stellen, 3 Nachkommastellen",
      }}
    />
  );
}
