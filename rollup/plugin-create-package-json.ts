import fs from 'node:fs';
import path from 'node:path';

type Options = {
  dist: string;
  basic: {
    data: {
      [P in string]: unknown;
    };
    keys: string[];
  };
  extra: {
    [P in string]: unknown;
  };
};

export default ({ dist, basic, extra }: Options) => {
  return {
    name: 'create-package-json',
    writeBundle: async () => {
      const sortPackageJson = await import('sort-package-json');
      const keys = new Set(Object.keys(basic.data));
      const obj = basic.keys.reduce((acc, cur) => {
        if (keys.has(cur)) {
          return {
            ...acc,
            [cur]: basic.data[cur],
          };
        } else {
          return acc;
        }
      }, {});

      const newData = sortPackageJson.default({
        ...obj,
        ...extra,
      });
      fs.writeFileSync(
        path.join(dist, 'package.json'),
        JSON.stringify(newData, null, 2),
      );
    },
  };
};
