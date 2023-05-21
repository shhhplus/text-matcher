type MatchedNode = {
  text: string;
  payload: {
    position: number;
    ruleIndex: number;
    matchIndex: number;
  };
};

type Node = MatchedNode | string;

type Task =
  | {
      done: true;
      node: MatchedNode;
    }
  | {
      done: false;
      node: string;
    };

type InnerRule = {
  index: number;
  pattern: RegExp;
};

export default function createTextMatcher(rules: (string | RegExp)[]) {
  const innerRules: InnerRule[] = rules
    .map<[string | RegExp, number]>((r, index) => {
      return [r, index];
    })
    .filter((r) => r[0])
    .map((r) => {
      if (typeof r[0] === 'string') {
        return {
          index: r[1],
          pattern: new RegExp(`${r[0]}`, 'g'),
        };
      } else {
        return {
          index: r[1],
          pattern: r[0],
        };
      }
    })
    .filter((r) => {
      const { source } = r.pattern;
      return source && source !== new RegExp('').source;
    });

  return {
    exec: (content: string) => {
      return compile(content, innerRules);
    },
  };
}

const compile = (content: string, innerRules: InnerRule[]): Node[] => {
  if (!content) {
    return [];
  }

  if (innerRules.length === 0) {
    return [content];
  }

  let tasks: Task[] = [{ done: false, node: content }];
  for (const rule of innerRules) {
    let skipable = false;
    tasks = tasks.reduce<Task[]>((acc, cur) => {
      if (cur.done || skipable) {
        return [...acc, cur];
      }
      const result = split(cur.node, rule);
      skipable = result.skipable;
      return [...acc, ...result.tasks];
    }, []);
  }
  const nodes = tasks.map((t) => t.node);
  let matchIndex = 0;
  let position = 0;
  nodes.forEach((node) => {
    if (typeof node === 'string') {
      position += node.length;
    } else {
      node.payload.position = position;
      node.payload.matchIndex = matchIndex++;
      position += node.text.length;
    }
  });

  return nodes;
};

const split = (
  content: string,
  rule: InnerRule,
): {
  tasks: Task[];
  skipable: boolean;
} => {
  const tasks: Task[] = [];
  let skipable = false;
  let cursor = 0;
  let result = null;
  while ((result = rule.pattern.exec(content)) !== null) {
    const value = result[0];
    const index = result.index;
    if (index !== cursor) {
      tasks.push({
        done: false,
        node: content.substring(cursor, index),
      });
    }

    tasks.push({
      done: true,
      node: {
        text: value,
        payload: {
          position: -1,
          ruleIndex: rule.index,
          matchIndex: -1,
        },
      },
    });
    cursor = index + value.length;

    if (!rule.pattern.global) {
      skipable = true;
      break;
    }
  }
  if (cursor < content.length) {
    tasks.push({
      done: false,
      node: content.substring(cursor),
    });
  }
  return { tasks, skipable };
};
