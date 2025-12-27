import type { FieldValues, Control, FieldErrors, Path } from 'react-hook-form';
import { GenericField } from './GenericField';

interface AbbildungFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  errors: FieldErrors<T>;
}

export function AbbildungField<T extends FieldValues>(
  props: AbbildungFieldProps<T>,
) {
  return (
    <>
      <GenericField
        {...props}
        label="Abbildung Beschriftung"
        name={`${props.name}.0.beschriftung` as Path<T>}
        rules={{
          required: 'Beschriftung ist erforderlich',
          maxLength: { value: 32, message: 'Maximal 32 Zeichen' },
        }}
      />
      <GenericField
        {...props}
        label="Abbildung Content-Type"
        name={`${props.name}.0.contentType` as Path<T>}
        rules={{
          required: 'Content-Type ist erforderlich',
          maxLength: { value: 16, message: 'Maximal 16 Zeichen' },
        }}
      />
    </>
  );
}
