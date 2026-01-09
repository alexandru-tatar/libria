import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';
import { isValidIsbn13 } from './isbn';

export const IsbnField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="ISBN-13"
      required
      placeholder="978-0-007-00644-1"
      rules={{
        required: 'ISBN ist erforderlich',
        validate: (value) =>
          isValidIsbn13(String(value)) || 'Ungültige ISBN-13',
      }}
    />
  );
};
