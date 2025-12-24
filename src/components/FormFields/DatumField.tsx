import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface DatumFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function DatumField<T extends FieldValues>({
  name,
  control,
  errors,
}: DatumFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Datum (optional)"
      type="date"
      rules={{
        validate: (value) =>
          !value ||
          /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ||
          'Datum muss im Format YYYY-MM-DD sein',
      }}
    />
  );
}
