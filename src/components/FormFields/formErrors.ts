import type {
    FieldError,
    FieldErrors,
    FieldValues,
    Path,
} from 'react-hook-form';

export const getErrorByPath = <T extends FieldValues>(
    errors: FieldErrors<T> | undefined,
    path: Path<T> | string,
): FieldError | undefined => {
    const result = String(path)
        .split('.')
        .reduce<unknown>((current, key) => {
            if (!current || typeof current !== 'object') return undefined;

            const record = current as Record<string, unknown>;
            if (!Object.prototype.hasOwnProperty.call(record, key))
                return undefined;

            return record[key];
        }, errors);

    if (result && typeof result === 'object' && 'message' in result) {
        return result as FieldError;
    }

    return undefined;
};
