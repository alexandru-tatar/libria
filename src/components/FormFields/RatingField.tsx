import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface RatingFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function RatingField<T extends FieldValues>({
  name,
  control,
  errors,
}: RatingFieldProps<T>) {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Bewertung"
      type="number"
      rules={{
        required: 'Bewertung ist erforderlich',
        min: { value: 0, message: 'Bewertung mindestens 0' },
        max: { value: 5, message: 'Bewertung maximal 5' },
      }}
    />
  );
}
