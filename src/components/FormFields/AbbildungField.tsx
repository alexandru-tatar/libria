import type { FieldValues, Path } from 'react-hook-form';
import type { BaseFieldProps } from './fieldProps';
import { GenericField } from './GenericField';

type AbbildungFieldProps<T extends FieldValues> = BaseFieldProps<T> & {
  index?: number;
};

export const AbbildungField = <T extends FieldValues>({
  name,
  control,
  errors,
  index = 0,
}: AbbildungFieldProps<T>) => {
  const prefix = `${String(name)}.${index}`;

  return (
    <>
      <GenericField
        name={`${prefix}.beschriftung` as Path<T>}
        control={control}
        errors={errors}
        label="Abbildung Beschriftung"
        rules={{
          required: 'Beschriftung ist erforderlich',
          maxLength: { value: 32, message: 'Maximal 32 Zeichen' },
        }}
      />

      <GenericField
        name={`${prefix}.contentType` as Path<T>}
        control={control}
        errors={errors}
        label="Abbildung Content-Type"
        rules={{
          maxLength: { value: 16, message: 'Maximal 16 Zeichen' },
        }}
      />
    </>
  );
};
