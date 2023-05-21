type MatchedNode = {
  text: string;
  payload: {
    index: number;
    position: number;
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

export default function createTextMatcher(rules: (string | RegExp)[]) {
  const rules2use: RegExp[] = rules
    .filter((r) => r)
    .map((r) => {
      if (typeof r === 'string') {
        return new RegExp(`${r}`, 'g');
      } else {
        return r;
      }
    })
    .filter((r) => r.source);

  return {
    exec: (content: string) => {
      return compile(content, rules2use);
    },
  };
}

const compile = (content: string, rules: RegExp[]): Node[] => {
  if (!content) {
    return [];
  }

  if (rules.length === 0) {
    return [content];
  }

  let tasks: Task[] = [{ done: false, node: content }];
  for (const rule of rules) {
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
  let index = 0;
  let position = 0;
  nodes.forEach((node) => {
    if (typeof node === 'string') {
      position += node.length;
    } else {
      node.payload.index = index++;
      node.payload.position = position;
      position += node.text.length;
    }
  });

  return nodes;
};

const split = (
  content: string,
  rule: RegExp,
): {
  tasks: Task[];
  skipable: boolean;
} => {
  const regex = rule;
  const tasks: Task[] = [];
  let skipable = false;
  let cursor = 0;
  let result = null;
  while ((result = regex.exec(content)) !== null) {
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
          index: -1,
          position: -1,
        },
      },
    });
    cursor = index + value.length;

    if (!regex.global) {
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
