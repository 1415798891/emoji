import fs from 'fs';
import axios from "axios";

const url = 'https://bbs-api.mihoyo.com/misc/api/emoticon_set'

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

axios.get(url).then(async (res) => {
  let emoData = res.data.data.list;
  for (let i = 0; i < emoData.length; i++) {
    let icon = emoData[i].icon;
    let dir = emoData[i].name;
    let endfix = icon.split('.').at(-1);
    let infoData = {
      name: '',
      icon: '',
      items: []
    }
    if (icon == '' || dir == '') continue;

    // 创建目录
    // fs.mkdirSync(`./emotion/${dir}`);

    // 判断文件是否已存在
    let cover = fs.existsSync(`./emotion/${dir}/${dir}.${endfix}`)
    if (!cover) {
      let img = await axios.get(icon, {
        responseType: 'arraybuffer',
      });

      fs.writeFileSync(`./${dir}/${dir}.${endfix}`, img.data);
    }
    infoData.name = dir;
    infoData.icon = `${dir}.${endfix}`;
    infoData.items.push(`${dir}.${endfix}`)
    for (let j = 0; j < emoData[i].list.length; j++) {
      // await sleep(500);
      let icon = emoData[i].list[j].icon;
      let name = emoData[i].list[j].name;
      let endfix = icon.split('.').at(-1);
      if (icon == '' || dir == '') continue;
      infoData.items.push(`${name}.${endfix}`);

      let itemname = fs.existsSync(`./${dir}/${name}.${endfix}`)
      if (!itemname) {
        let img = await axios.get(icon, {
          responseType: 'arraybuffer',
        });
        fs.writeFileSync(`.${dir}/${name}.${endfix}`, img.data);
        console.log(`${dir} ${name}下载成功`);
      }
    }
    console.log(infoData);
    fs.writeFileSync(`./${dir}/info.json`, JSON.stringify(infoData));
  }
})
