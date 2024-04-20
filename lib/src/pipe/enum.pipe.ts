import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'enum', standalone: true })
export class EnumPipe implements PipeTransform {
  transform(value: any, input: Map<string, any> | Record<string, any>, defaultValue?: any): string {
    if (input instanceof Map) {
      return input.get(value) ?? defaultValue;
    }
    return input[value] ?? defaultValue;
  }
}
