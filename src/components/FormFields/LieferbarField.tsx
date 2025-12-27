import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface LieferbarFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function LieferbarField<T extends FieldValues>({
  name,
  control,
  errors,
}: LieferbarFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Lieferbar (optional)"
      type="checkbox"
    />
  );
}
