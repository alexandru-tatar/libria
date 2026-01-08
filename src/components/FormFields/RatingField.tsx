import type { FieldValues } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

export const RatingField = <T extends FieldValues>({
  name,
  control,
  errors,
}: BaseFieldProps<T>) => {
  return (
    <GenericField
      name={name}
      control={control}
      errors={errors}
      label="Bewertung"
      required
      type="number"
      rules={{
        required: 'Bewertung ist erforderlich',
        min: { value: 0, message: 'Bewertung mindestens 0' },
        max: { value: 5, message: 'Bewertung maximal 5' },
      }}
    />
  );
};
