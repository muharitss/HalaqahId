export interface SchemaField {
  key: string;
  label: string;
  type: "COUNTER" | "SLIDER" | "TEXTAREA" | "NUMBER";
  min?: number;
  max?: number;
  default?: any;
  isKeyUnlocked?: boolean;
}

/** Client-side expression evaluator */
export function evaluateFormula(
  expression: string,
  context: Record<string, number>,
): number {
  let exprStr = expression;
  const fullContext = { ...context };

  const variableNames = expression.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  for (const name of variableNames) {
    if (!(name in fullContext)) {
      fullContext[name] = 0;
    }
  }

  const keys = Object.keys(fullContext).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\b${escapedKey}\\b`, "g");
    exprStr = exprStr.replace(regex, fullContext[key].toString());
  }

  const tokens = exprStr.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\(|\))/g) || [];
  const values: number[] = [];
  const ops: string[] = [];

  const precedence = (op: string): number => {
    if (op === "+" || op === "-") return 1;
    if (op === "*" || op === "/") return 2;
    return 0;
  };

  const applyOp = (op: string, b: number, a: number): number => {
    switch (op) {
      case "+":
        return a + b;
      case "-":
        return a - b;
      case "*":
        return a * b;
      case "/":
        return b === 0 ? 0 : a / b;
    }
    return 0;
  };

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (!isNaN(Number(t))) {
      values.push(Number(t));
    } else if (t === "(") {
      ops.push(t);
    } else if (t === ")") {
      while (ops.length && ops[ops.length - 1] !== "(") {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        if (val1 !== undefined && val2 !== undefined && op !== undefined) {
          values.push(applyOp(op, val2, val1));
        }
      }
      ops.pop();
    } else if (["+", "-", "*", "/"].includes(t)) {
      while (ops.length && precedence(ops[ops.length - 1]) >= precedence(t)) {
        const val2 = values.pop();
        const val1 = values.pop();
        const op = ops.pop();
        if (val1 !== undefined && val2 !== undefined && op !== undefined) {
          values.push(applyOp(op, val2, val1));
        }
      }
      ops.push(t);
    }
  }

  while (ops.length) {
    const val2 = values.pop();
    const val1 = values.pop();
    const op = ops.pop();
    if (val1 !== undefined && val2 !== undefined && op !== undefined) {
      values.push(applyOp(op, val2, val1));
    }
  }

  return values[0] || 0;
}
