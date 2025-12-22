import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';
import { isValidIsbn13 } from './isbn';

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
        required: 'ISBN ist erforderlich',
        validate: (value) => isValidIsbn13(String(value)) || 'Ungültige ISBN-13',
      }}
    />
  );
}
