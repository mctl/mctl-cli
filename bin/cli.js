#! /usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
const figlet = require('figlet');
const create = require('../lib/create.js');

const urls = {
  dumiUrl: 'mctl/template#dumi',
  cptUrl: 'mctl/template#cpt',
};

program
  // 定义命令和参数
  .command('dumi <app-name>')
  .description('创建dumi组件库项目')
  .option('-f, --force', '强制覆盖目录')
  .action((name, options) => {
    create(name, options, urls.dumiUrl, true);
  });

program
  .command('cpt <cpt-name>')
  .description('创建React函数组件')
  .option('-f, --force', '强制覆盖目录')
  .action((name, options) => {
    create(name, options, urls.cptUrl, false);
  });

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`)
  .usage('<command> [option]');

program.on('--help', () => {
  // 绘制 Logo
  console.log(
    '\r\n' +
      figlet.textSync('mctl', {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      }),
  );
  // 说明信息
  console.log(`\r\nRun ${chalk.cyan(`mctl <command> --help`)} show details\r\n`);
});

// 解析用户执行命令传入参数
program.parse(process.argv);
