const path = require('path');

function isLocalPath (templatePath) {
  return /^[./]|(^[a-zA-Z]:)/.test(templatePath);
}

function getTemplatePath (templatePath) {
  return path.isAbsolute(templatePath)
    ? templatePath
    : path.normalize(path.join(process.cwd(), templatePath));
}

module.exports = {
  isLocalPath: isLocalPath,
  getTemplatePath: getTemplatePath,
};
