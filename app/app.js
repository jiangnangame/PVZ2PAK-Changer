"use strict";
const fs = require("fs");
const MyTools = {
    show: (...Eles) => Eles.forEach(ele => ele.style.display = 'block'),
    hide: (...Eles) => Eles.forEach(ele => ele.style.display = 'none'),
};
const MyApp = {
    dir: null,
    datas: null,
    init(dir) {
        fs.readFile(dir + '/ornament.json', (err, data) => {
            if(err) {
                return alert('程序找不到装扮配置文件，请选择存放游戏本体的文件夹！');
            }
            userDir.value = this.dir = dir;
            this.datas = JSON.parse(data).datas;
            this.renderMain(this.datas);
        });
    },
    renderMain(datas) {
        let pHtml = '';
        let zHtml = '';
        let tHtml = '';
        MyTools.show(remove, plantTabel, zombieTabel, themeTabel);
        datas.plant.forEach(json => {
            pHtml += `<button class='tab plant' data-target='${JSON.stringify(json.target)}' data-orn='${JSON.stringify(json.ornaments)}'>${json.name}</button>`;
        });
        plants.innerHTML = pHtml;
        //生成僵尸选项卡
        datas.zombie.forEach(json => {
            zHtml += `<button class='tab zombie' data-target='${JSON.stringify(json.target)}' data-orn='${JSON.stringify(json.ornaments)}'>${json.name}</button>`;
        });
        zombies.innerHTML = zHtml;
        //生成僵尸选项卡
        datas.theme.forEach(json => {
            tHtml += `<button class='tab theme' data-target='${JSON.stringify(json.target)}' data-orn='${JSON.stringify(json.ornaments)}'>${json.name}</button>`;
        });
        theme.innerHTML = tHtml;
    },
    renderSelectors(datas, target) {
        MyTools.show(orns, returnButton);
        MyTools.hide(plantTabel, zombieTabel, themeTabel);
        let html = '';
        datas.forEach(data => {
            html += `<button class='tab orn' data-res='${JSON.stringify(data.slice(1))}' data-target='${target}'>${data[0]}</button>`;
        });
        orns.innerHTML = html;
    },
    removeAll() {
        let datas = [...this.datas.plant, ...this.datas.zombie, ...this.datas.theme];
        let tasks = [];
        datas.forEach(json => tasks.push(this.copy(json.ornaments[0].slice(1), json.target)));
        Promise.all(tasks).then(_ => alert('您已卸下所有装扮！'));
    },
    copy(res, target) {
        let tasks = [];
        target.forEach((targetName, index) => {
            tasks.push(new Promise((success, fail) => {
                let readStream=fs.createReadStream(`${this.dir}/${res[index]}.png`);   //被复制文件
                let writeStream=fs.createWriteStream(`${this.dir}/${targetName}.png`);  //复制到的目标位置及文件
                readStream.pipe(writeStream);
                readStream.on('end', success);
                readStream.on('error', err => {
                    fail();
                    alert(err);
                });
            }));
        });
        return Promise.all(tasks);
    },
};