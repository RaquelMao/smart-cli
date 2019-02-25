const program = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const path = require('parh');
const ora = require('ora');
const os = require('os');
const download = require('download-git-repo');
const shell = require('shelljs');
const exists = require('fs').existsSync;

const localPath = require('../src/local-path');
const { isLocalPath, getTemplatePath } = localPath;
const generate = require('../src/generate');
const checkVersion = require('../src/check-version');
const checkRepos = require('../src/check-repos');

/**
 * 程序入口
 */
function main() {
  /**
   * Usage.
   */

  program
    .usage('<template-name> [project-name]')
    .option('-c, --clone', 'use git clone');

  /**
   * Help.
   */

  program.on('--help', function () {
    log.tips('  Examples:');
    log.tips();
    log.tips(chalk.gray('    # create a new project with an template from github.'));
    log.tips('    $ smart init my-template my-project');
    log.tips();
  });

  function help () {
    program.parse(process.argv);
    if (program.args.length < 1) {
      return program.help();
    }
  }

  help();

  let template = program.args[0];

  let rawName = program.args[1];
  if(!rawName || /^\w:\/?$/.test(rawName)) {
    rawName = '.'
  }
  let projectName = rawName === '.' ? path.relative('../', process.cwd()) : rawName;
  const projectDirPath = path.resolve(projectName);
  const clone = program.clone || false;

  if (exists(projectDirPath)) {
    inquirer.prompt([{
      type: 'confirm',
      message: rawName === '.'
        ? 'Generate project in current directory?'
        : 'Target directory exists. Continue?',
      name: 'ok'
    }]).then((answers) => {
      if(answers.ok){
        run();
      }
    });
  } else {
    run();
  }

  function run() {
    if (isLocalPath(template)) { // 是否为本地模板
      const templatePath = getTemplatePath(template); // 获取模板路径
      if (exists(template)) {
        generate(projectName, templatePath, projectDirPath);
      } else {
        console.log('Local template not found');
      }
    } else { // 不是本地模板，需要下载
      // convert template path to xxx/xxx
      template = template.split(path.sep).slice(0, 2).join('/');
      // check repo from github.com
      checkVersion(() => {
        checkRepos(template, downloadAndGenerate);
      });
    }
  }

  function downloadAndGenerate(template) {
    const tmp = os.tmpdir() + '/smart-template-' + uuidV1(); // 暂存模板
    const spinner = ora({
      text:`start downloading template: ${template}`,
      color:"blue"
    }).start();

    download(template, tmp, { clone: clone }, (error) => {
      process.on('exit', () => rm(tmp)); // 删除模板

      if (error) {
        spinner.text = chalk.red(`Failed to download template ${ template }: ${ error.message.trim() }`);
        spinner.fail();
        process.exit(1);
      }
      spinner.text = chalk.green(`${ template } downloaded success`);
      spinner.succeed();

      generate(projectName, tmp, projectDirPath);
    })
  }
}

if (require.main === module) {
  main();
}
