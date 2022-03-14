import React from 'react';
import { AddressSelect } from '../account/Select';
import { Input } from './Input';
import { InputBalance } from './InputBalance';
import { InputNumber } from './InputNumber';
import { Vector } from './Vector';
import { Bool } from './Bool';
import { Enum } from './Enum';
import { ArgComponentProps, Registry, TypeDef, TypeDefInfo, ValidFormField } from 'types';

// nestingNumber counts the depth of nested components
export function findComponent(
  registry: Registry,
  type: TypeDef,
  nestingNumber = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.ComponentType<ArgComponentProps<any>> {
  if (type.info === TypeDefInfo.Si) {
    return findComponent(registry, registry.lookup.getTypeDef(type.type));
  }

  if (type.info === TypeDefInfo.Enum) {
    return (props: React.PropsWithChildren<ValidFormField<Record<string, unknown>>>) => (
      <Enum
        components={(type.sub as TypeDef[]).map(enumVariant =>
          findComponent(registry, enumVariant)
        )}
        registry={registry}
        typeDef={type}
        {...props}
      />
    );
  }
  if (type.sub && !Array.isArray(type.sub)) {
    const Component = findComponent(registry, type.sub, nestingNumber + 1);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment
    return (props: any) => Vector({ Component, props: { ...props, nestingNumber, type } });
  }
  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    case 'i32':
    case 'BN':
      return InputNumber;

    default:
      return Input;
  }
}
