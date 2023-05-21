import fs from 'node:fs';
import path from 'node:path';

type Options = {
  folder: string;
  requirements: string[];
};

export default ({ folder, requirements }: Options) => {
  return {
    name: 'clear-declaration',
    writeBundle: () => {
      const oldFolder = path.join(process.cwd(), folder);
      const tempFolder = path.join(process.cwd(), `${folder}-${Date.now()}`);

      fs.mkdirSync(tempFolder);

      for (const filePath of requirements) {
        const obj = path.parse(filePath);
        fs.copyFileSync(
          path.join(folder, filePath),
          path.join(tempFolder, obj.base),
        );
      }

      fs.rmSync(oldFolder, { recursive: true });
      fs.renameSync(tempFolder, oldFolder);
    },
  };
};
