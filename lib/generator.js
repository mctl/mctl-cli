const util = require('util');
const path = require('path');
const ora = require('ora');
const chalk = require('chalk');
const downloadGitRepo = require('download-git-repo');
const glob = require('glob');
const ejs = require('ejs');
const fs = require('fs-extra');

// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    await fn(...args);
    // 成功
    spinner.succeed();
    return true;
  } catch (error) {
    // 失败
    spinner.fail('Request failed, refetch ...');
    return false;
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;

    this.downloadGitRepo = util.promisify(downloadGitRepo);
  }

  async download(url) {
    const result = await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      url, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir),
    ); // 参数2: 创建位置

    return result;
  }

  async create(url, name, tips) {
    const result = await this.download(url);

    if (result) {
      console.log(`\r\n${chalk.green('download success')}`);
      console.log(`\r\n${chalk.cyan('render...')}`);

      const files = glob.sync(`${name}/**/*`, { nodir: true });

      files?.forEach(async (file) => {
        const filePath = path.resolve(process.cwd(), file);
        const data = {
          name,
        };

        const result = await ejs.renderFile(filePath, data);
        fs.writeFileSync(filePath, result);
      });

      console.log(
        `\r\n${chalk.green('create success: ')} ${chalk.cyan(this.name)}`,
      );

      if (tips) {
        console.log(`\r\n  cd ${chalk.cyan(this.name)}`);
        console.log('  yarn start\r\n');
      }
      return;
    }
    console.log(`\r\n${chalk.red('failed')}`);
  }
}

module.exports = Generator;
