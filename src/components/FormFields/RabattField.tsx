import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

export const RabattField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Rabatt"
      type="number"
      helperText="0–1 (z.B. 0.2 = 20%)"
      rules={{
        min: { value: 0, message: 'Rabatt muss ≥ 0 sein' },
        max: { value: 1, message: 'Rabatt muss ≤ 1 sein' },
        validate: (value) =>
          value === '' ||
          value == null ||
          /^\d{1}(\.\d{1,3})?$/.test(String(value)) ||
          'Format z.B. 0.2 (max. 3 Nachkommastellen)',
      }}
    />
  );
};
