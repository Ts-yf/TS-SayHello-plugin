/**
 * Plugin name : TS每日问候
 * Author : TS霆生
 * Version : 1.0.0
 * Docs : 由QYBot插件移植的TS每日问候
 * 每日进行早安，晚安，60s
 * 适配TRSS-Yunzai
 * 支持自定义问候时间，转发群，图片接口
 * 下方设置区进行设置
 * 指令：
 * 问候状态：检测是否在线
 * 群列表：查看加入的群，在trss上用来获取群id
 * 添加问候群： 后加上群号
 * 删除问候群：同上
 */

import plugin from '../../lib/plugins/plugin.js'; //每个插件必须带的库
import fetch from 'node-fetch'; //网页访问用的
import {
    segment
}
from 'oicq'; //用于构造消息元素，了解更多请访问https://oicqjs.github.io/oicq/#namespace-segment
import fs from 'fs';
import p from '../../lib/puppeteer/puppeteer.js';

//设置区
const t_m_h = 6; //早安时
const t_m_m = 40; //早安分
const t_n_h = 22; //晚安时
const t_n_m = 0; //晚安分
const t_ne_h = 8; //早报时
const t_ne_m = 0; //早报分
const zwa = 'http://42.192.221.73/to_image/out_image.php';//早晚安图片接口
const zb = 'https://api.52vmy.cn/api/wl/60s';//早报图片接口
//设置区END


const dp = process.cwd() + '/TS-EX-Data/TS-sayhello.json'; //data_path
const _dp = process.cwd() + '/TS-EX-Data'; //root_data_path
if (!fs.existsSync(_dp)) {
    // 创建文件并写入JSON数据
    fs.mkdirSync(_dp);
    };
    if (!fs.existsSync(dp)) {
    fs.writeFileSync(dp, JSON.stringify({
        632910692: 'on'
    }));
    console.log('配置文件已保存在：' + dp);
};
if (fs.existsSync(dp)) {
logger.info('「TS每日问候」配置文件读取加载完成');
}
var taskid
export class example extends plugin { //插件的一个函数组，可以创建多个，以对不同消息类型进行处理，此为消息处理函数
    constructor() {
        super({
            /** 功能名称 */
            name: 'TS-每日问候',
            /** 功能介绍 */
            dsc: '早安，晚安，60s',
            /** https://oicqjs.github.io/oicq/#events */
            event: 'message', //消息匹配类型，“massage”处理消息的意思，详情看上面那个网站
            /** 优先级，数字越小等级越高 */
            priority: 5000,
            rule: [{
                /** 命令正则匹配 */
                reg: '^问候状态$', //用正则表达式
                /** 执行方法 */
                fnc: 'test' //可以中文或英文
            }, {
                reg: "^添加问候群(.*)$",
                fnc: 'add',
                permission: 'master'
            }, {
                reg: "^群列表$",
                fnc: 'cha',
                permission: 'master'
            }, {
                reg: "^删除问候群(.*)$",
                fnc: 'del',
                permission: 'master'
            }]
        })
    }
    async test(e) {
        /** e.msg 用户的命令消息 */
        logger.info('[用户命令]', e.msg)
        /** 最后回复消息 */
        await e.reply("「TS-每日问候」运行中", true)
    }

    async add(e) {
        logger.info('[TSBot]', e.msg);
        let msg = e.msg.replace("添加问候群", "")
            .trim();
        let jsondata = fs.readFileSync(dp);
        try {
            jsondata = JSON.parse(jsondata);
            jsondata[msg] = 'on';
            jsondata = JSON.stringify(jsondata);
            fs.writeFileSync(dp, jsondata);
            await e.reply('“' + msg + '”Add succeed');
        } catch (err) {
            await e.reply('添加失败：' + err)
        }
    }

    async cha(e) {
        let list = [];
        for (var [key, value] of Bot.gl) {
            list.push({
                groupName: value.group_name,
                groupId: key
            });
        };
        this.e.reply(`目前加入的群组有\n${list.map((item, index) => `${index + 1}. ${item.groupName}(${item.groupId})`)
                .join("\n")
        }`);

        // await e.reply(String(this.e.group.getInfo));
    }

    async del(e) {
        logger.info('[TSBot]', e.msg);
        let msg = e.msg.replace("删除问候群", "")
            .trim();
             let jsondata = fs.readFileSync(dp);
        try {
            jsondata = JSON.parse(jsondata);
            jsondata[msg] = 'off';
            jsondata = JSON.stringify(jsondata);
            fs.writeFileSync(dp, jsondata);
            await e.reply('“' + msg + '”Add succeed');
        } catch (err) {
            await e.reply('操作失败：' + err)
            }
    }
};
ontask();

function ontask() {
    taskid = setInterval(istime, 900);
};

function istime() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    if (h == t_m_h && m == t_m_m) {
        good_morning();
        clearInterval(taskid);
        setTimeout(ontask, 70000)
    };
    if (h == t_n_h && m == t_n_m) {
        good_night();
        clearInterval(taskid);
        setTimeout(ontask, 70000)
    };
    if (h == t_ne_h && m == t_ne_m) {
        good_news();
        clearInterval(taskid);
        setTimeout(ontask, 70000)
    };
};

function good_morning() {
    const group = JSON.parse(fs.readFileSync(dp));
    let img = segment.image(zwa);
    for (var q in group) {
        if (group[q] == 'on') {
            if (Bot.pickGroup(q)) {
                Bot.pickGroup(q)
                    .sendMsg(img);
            }
        }
    };
};

function good_night() {
    const group = JSON.parse(fs.readFileSync(dp));
    let img = segment.image(zwa);
    for (var q in group) {
        if (group[q] == 'on') {
            if (Bot.pickGroup(q)) {
                Bot.pickGroup(q)
                    .sendMsg(img);
            }
        }
    };
};

function good_news() {
    const group = JSON.parse(fs.readFileSync(dp));
    let img = segment.image(zb);
    for (var q in group) {
        if (group[q] == 'on') {
            if (Bot.pickGroup(q)) {
                Bot.pickGroup(q)
                    .sendMsg(img);
            }
        }
    };
};
logger.info('———(*≧▽≦) ———');
logger.info('「TS每日问候」加载完成');
logger.info('———————————');
