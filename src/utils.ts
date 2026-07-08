export function isObject(val: unknown): val is Record<string, any> {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

export function hasEntityId(val: unknown): val is { entity_id: string } & Record<string, any> {
  return isObject(val) && 'entity_id' in val && typeof val.entity_id === 'string';
}

export function evaluateStateMapping<T>(state: string, mapping?: Record<string, T>): T | undefined {
  if (!mapping) return undefined;

  if (mapping[state] !== undefined) {
    return mapping[state];
  }

  const lowerStateStr = state.toLowerCase();
  const matchEntry = Object.entries(mapping).find(([key]) => key.toLowerCase() === lowerStateStr);

  if (matchEntry) {
    return matchEntry[1];
  }

  const currentNum = parseFloat(state);
  if (!isNaN(currentNum)) {
    for (const [key, val] of Object.entries(mapping)) {
      const match = key.match(/^\s*(>=|<=|>|<|!=|==|=)\s*(.+)$/);
      if (match) {
        const operator = match[1];
        const targetNum = parseFloat(match[2]);
        if (!isNaN(targetNum)) {
          if (operator === '>' && currentNum > targetNum) return val;
          if (operator === '>=' && currentNum >= targetNum) return val;
          if (operator === '<' && currentNum < targetNum) return val;
          if (operator === '<=' && currentNum <= targetNum) return val;
          if ((operator === '==' || operator === '=') && currentNum === targetNum) return val;
          if (operator === '!=' && currentNum !== targetNum) return val;
        }
      }
    }
  }

  return undefined;
}
