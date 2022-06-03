// Copyright 2022 @paritytech/contracts-ui authors & contributors
// SPDX-License-Identifier: GPL-3.0-only

import { AddressSelect } from '../account/Select';
import { Input } from './Input';
import { InputBalance } from './InputBalance';
import { InputNumber } from './InputNumber';
import { Vector } from './Vector';
import { SubForm } from './SubForm';
import { Bool } from './Bool';
import { Enum } from './Enum';
import { Option } from './Option';
import { VecFixed } from './VecFixed';
import { Tuple } from './Tuple';
import { Struct } from './Struct';
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

  if (type.info === TypeDefInfo.Option) {
    return (props: React.PropsWithChildren<ValidFormField<unknown>>) => (
      <Option
        component={findComponent(registry, type.sub as TypeDef)}
        registry={registry}
        typeDef={type}
        {...props}
      />
    );
  }

  if (type.info === TypeDefInfo.VecFixed) {
    const sub = type.sub as TypeDef;

    return (props: React.PropsWithChildren<ValidFormField<unknown[]>>) => (
      <SubForm nestingNumber={nestingNumber}>
        <VecFixed
          component={findComponent(registry, sub)}
          nestingNumber={nestingNumber + 1}
          registry={registry}
          typeDef={type}
          {...props}
        />
      </SubForm>
    );
  }

  if (type.info === TypeDefInfo.Tuple) {
    console.log(type);
    return (props: React.PropsWithChildren<ValidFormField<unknown[]>>) => (
      <Tuple
        components={(type.sub as TypeDef[]).map(subType =>
          findComponent(registry, subType)
        )}
        registry={registry}
        typeDef={type}
        {...props}
      />
    );
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

  if (type.info === TypeDefInfo.Struct) {
    if (Array.isArray(type.sub)) {
      const components = type.sub.map(
        subtype => findComponent(registry, subtype, nestingNumber + 1)
      );
      return (props: ArgComponentProps<Record<string, unknown>>) => (
        <SubForm nestingNumber={nestingNumber}>
          <Struct
            components={components}
            nestingNumber={nestingNumber + 1}
            registry={registry}
            type={type}
            {...props}
          />
        </SubForm>
      )
    }
  }

  if (type.info === TypeDefInfo.Vec) {
    if (type.sub && !Array.isArray(type.sub)) {
      const Component = findComponent(registry, type.sub, nestingNumber + 1);

      return (props: ArgComponentProps<unknown[]>) => (
        <SubForm nestingNumber={nestingNumber}>
          <Vector
            Component={Component}
            nestingNumber={nestingNumber}
            registry={registry}
            type={type}
            {...props}
          />
        </SubForm>
      )
        
    }
  }

  if (type.info === TypeDefInfo.Compact) {
    return findComponent(registry, type.sub as TypeDef);
  }

  switch (type.type) {
    case 'AccountId':
    case 'Address':
      return AddressSelect;

    case 'Balance':
      return InputBalance;

    case 'bool':
      return Bool;

    case 'u8':
    case 'i8':
    case 'i32':
    case 'u32':
    case 'i64':
    case 'u64':
    case 'BN':
      return InputNumber;

    default:
      return Input;
  }
}
