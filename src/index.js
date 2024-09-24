import glob from 'glob';
import path from 'path';

/*
  be aware that it will not ignore the commented lines of imports
*/
export default function globImportRoutes(source) {
  this.cacheable(true);
  // const options = this.getOptions();
  const regex = /.?import + ?((\w+) +from )?([\'\"])(.*?)\3/gm;
  const importModules = /import +(\w+) +from +([\'\"])(.*?)\2/gm;
  const importFiles = /import +([\'\"])(.*?)\1/gm;
  const importSass = /@import +([\'\"])(.*?)\1/gm;
  const resourceDir = path.dirname(this.resourcePath);

  // this.addContextDependency(resourceDir);
  const addContextDependency = this.addContextDependency;

  /*
  not optimal because it will only watch on file directory 
  its better to make it watch search path 
  */

  function replacer(match, fromStatement, obj, quote, filename) {
    const modules = [];
    let withModules = false;
    /*
      ex: import modules from './pages/**/ /*.jsx'; 
      filename: ./pages/**/ /*.jsx
      quote: '
      obj: modules
      match: import modules from './pages/**/ /*.jsx'
     */
    if (!glob.hasMagic(filename)) return match;

    let result = glob
      .sync(filename, {
        cwd: resourceDir,
      })
      .map(function (file, index) {
        const fileName = quote + file + quote;

        if (match.match(importSass)) {
          return '@import ' + fileName;
        } else if (match.match(importModules)) {
          const moduleName = obj + index;
          modules.push({ moduleName, fileName });
          withModules = true;
          return 'import * as ' + moduleName + ' from ' + fileName;
        } else if (match.match(importFiles)) {
          return 'import ' + fileName;
        }
      })
      .join('; ');
    if (result && withModules) {
      addContextDependency(getDirToWatch(resourceDir, filename));

      const final = modules
        .map(el => {
          return `{ module: ${el.moduleName}, path: ${el.fileName} }`;
        })
        .join(', ');
      result += '; let ' + obj + ' = [' + final + ']';
    }

    if (!result) {
      result = 'const ' + obj + ' = []';
    }
    return result;
  }
  const res = source.replace(regex, replacer);
  return res;
}

/*
getDirToWatch('/base/search/path','./pages/**/ /*.jsx');
>> /base/search/path/pages
*/
const getDirToWatch = (basePath, globPath) => {
  return path.join(basePath, globPath).split('*')[0];
};
