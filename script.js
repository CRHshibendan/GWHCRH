// ===== 鸟类数据(介绍来自《东滩湿地鸟类资源手册》,图片为本地图片) =====
// 图片目录: 新建文件夹/<分类>/<鸟名> (N).png
// 资源已迁移至 assets/ 目录,路径完整无需前缀
var IMG_DIR = '';

var BIRDS = [
    // 鸻鹬类
    {
        name: '反嘴鹬', latin: 'Recurvirostra avosetta', keywords: 'fanzuiyu fzy',
        desc: '反嘴鹬科,又名反嘴鸻,体长38-45厘米。眼先、前额、头顶至颈上部黑色,形成黑色帽状斑,其余颈部、背、腰和整个下体白色。嘴黑色且显著上翘,脚蓝灰色。',
        call: '叫声:连续清脆的"克利—克利—克利"',
        images: ['assets/images/fanzuiyu-main.jpg', 'assets/images/shorebirds/fanzuiyu-1.png', 'assets/images/shorebirds/fanzuiyu-2.png'],
        audio: 'assets/audio/fanzuiyu-main.m4a'
    },
    {
        name: '凤头麦鸡', latin: 'Vanellus vanellus', keywords: 'fengtoumaiji ftmj',
        desc: '鸻形目鸻科,体型中等,腿长,头顶具细长羽冠。头顶至羽冠黑色,脸白色,眼下方有黑斑,喉部黑色链接至上胸的黑色宽环带。背、翼上覆羽及三级飞羽绿色,具金属光泽。',
        call: '叫声:响亮的"披衣—披衣—披衣"',
        images: ['assets/images/shorebirds/fengtoumaiji-1.png', 'assets/images/shorebirds/fengtoumaiji-2.png', 'assets/images/shorebirds/fengtoumaiji-3.png'],
        audio: 'assets/audio/fengtoumaiji.m4a'
    },
    // 雁鸭类
    {
        name: '斑头秋沙鸭', latin: 'Mergellus albellus', keywords: 'bantouqiushaya btqsy',
        desc: '鸭科斑头秋沙鸭属。雄鸟眼先和眼周黑色成块斑状,头部其余部分全白,背黑色,下体白色,体侧羽毛具黑褐色波状细纹。雌鸟头顶栗色,眼先和脸黑色,体的两侧为灰褐色。',
        call: '叫声:粗哑低沉的"咔—咔—"',
        images: ['assets/images/waterfowl/bantouqiushaya-1.png', 'assets/images/waterfowl/bantouqiushaya-2.png', 'assets/images/waterfowl/bantouqiushaya-3.png'],
        audio: 'assets/audio/bantouqiushaya.m4a'
    },
    {
        name: '罗纹鸭', latin: 'Mareca falcata', keywords: 'luowenya lwy',
        desc: '雁形目鸭科,又名葭凫、镰刀鸭。雄鸟头顶至后颈栗色,头侧及冠羽铜绿色,上体浅灰色密布暗褐色波状细纹,三级飞羽延长呈镰状。胸、腹、胁部密布黑白波纹,形似编织物而得名。',
        call: '叫声:低弱的"嘎—嘎—"',
        images: ['assets/images/waterfowl/luowenya-1.png', 'assets/images/waterfowl/luowenya-2.png', 'assets/images/waterfowl/luowenya-3.png'],
        audio: 'assets/audio/luowenya.m4a'
    },
    {
        name: '琵嘴鸭', latin: 'Spatula clypeata', keywords: 'pizuiya pzy',
        desc: '雁形目鸭科。雄鸟头颈部墨绿色带金属光泽,翼镜金属绿色,腹部和胁部锈红色,喙大呈铲状,蹼足鲜橘色;雌鸟周身呈斑驳的麻褐色,喙同雄鸟大而呈铲状但为褐色。',
        call: '叫声:雄鸟低沉的"帕克—帕克—",雌鸟轻快的嘎嘎声',
        images: ['assets/images/waterfowl/pizuiya-1.png', 'assets/images/waterfowl/pizuiya-2.png', 'assets/images/waterfowl/pizuiya-3.png'],
        audio: 'assets/audio/pizuiya.m4a'
    },
    {
        name: '小天鹅', latin: 'Cygnus columbianus', keywords: 'xiaotianer xte',
        desc: '雁形目鸭科天鹅属。成鸟体长110-135厘米,全身羽毛洁白,喙黑色且基部两侧具黄斑(黄斑仅延伸至鼻孔附近),相较天鹅体型更小、颈部较短。幼鸟体羽淡灰褐色,喙基粉红色。',
        call: '叫声:清亮的"阔—阔—阔",似哨音',
        images: ['assets/images/waterfowl/xiaotianer-1.png', 'assets/images/waterfowl/xiaotianer-2.png'],
        audio: 'assets/audio/xiaotianer.m4a'
    },
    {
        name: '中华秋沙鸭', latin: 'Mergus squamatus', keywords: 'zhonghuaqiushaya zhqsy',
        desc: '雁形目鸭科,无亚种分化,国家一级保护动物。羽冠长而明显成双冠状,嘴长而窄呈红色。雄鸟头、上背及肩羽黑色,两胁具黑色鳞状纹;因身上两侧有鱼鳞斑、头顶羽冠像满清官员的花翎,又被称为"鳞肋秋沙鸭"。',
        call: '叫声:低哑的"嘎—嘎—"',
        images: ['assets/images/waterfowl/zhonghuaqiushaya-1.png', 'assets/images/waterfowl/zhonghuaqiushaya-2.png', 'assets/images/waterfowl/zhonghuaqiushaya-3.png'],
        audio: 'assets/audio/zhonghuaqiushaya.m4a'
    },
    {
        name: '花脸鸭', latin: 'Sibirionetta formosa', keywords: 'hualianya hly',
        desc: '雁形目鸭科,又称黄尖鸭、黑眶鸭、元鸭。雄鸟脸部由黄、绿、黑、白等多种颜色组成花纹,胸部棕色,肩羽长,翼镜绿色;雌鸟上体大致为暗褐色,嘴后有一白色圆斑。',
        call: '叫声:高亢的"嘎—嘎嘎嘎"',
        images: ['assets/images/waterfowl/hualianya-1.png', 'assets/images/waterfowl/hualianya-2.png', 'assets/images/waterfowl/hualianya-3.png'],
        audio: 'assets/audio/hualianya.m4a'
    },
    {
        name: '斑嘴鸭', latin: 'Anas zonorhyncha', keywords: 'banzuiya bzy',
        desc: '雁形目鸭科。雄鸟体羽大部棕褐色,嘴蓝黑色、先端黄色,嘴基至耳区有黑褐色贯眼线;翼镜蓝绿色带紫色金属光泽。因嘴端有黄斑而得名。雌鸟嘴端黄斑不明显,下体淡白色杂暗色斑。',
        call: '叫声:响亮连续的"嘎—嘎—嘎—"',
        images: ['assets/images/waterfowl/banzuiya-1.png', 'assets/images/waterfowl/banzuiya-2.png', 'assets/images/waterfowl/banzuiya-3.png'],
        audio: 'assets/audio/banzuiya.m4a'
    },
    // 琵鹭
    {
        name: '白琵鹭', latin: 'Platalea leucorodia', keywords: 'baipilu bpl',
        desc: '鹮科琵鹭属大型涉禽。成鸟喙长而直、上下扁平,先端膨大呈琵琶形,喙表面带密集的横向条纹;夏羽绝大部分白色,头后枕部披散沾浅金色的丝状冠羽,前颈下部晕染玉黄色。',
        call: '叫声:幼鸟乞食时急促的"嘎嘎嘎",成鸟多为沉默',
        images: ['assets/images/spoonbills/baipilu-1.png', 'assets/images/spoonbills/baipilu-2.png', 'assets/images/spoonbills/baipilu-3.png', 'assets/images/spoonbills/pilu-1.png', 'assets/images/spoonbills/pilu-2.png', 'assets/images/spoonbills/pilu-3.png'],
        audio: 'assets/audio/baipilu.m4a'
    },
    {
        name: '黑脸琵鹭', latin: 'Platalea minor', keywords: 'heilianpilu hlpl',
        desc: '鹈形目鹮科琵鹭属,国家一级保护动物。成鸟体羽白色,喙长直而扁平,先端膨大呈琵琶状;嘴基到额、脸、眼先、眼周以及喉部为连成一体的黑色裸露区域,虹膜深红色,脚黑色。因扁平而长的嘴与琵琶相似而得名。',
        call: '叫声:巢内幼鸟的"嘎嘎"声,成鸟多静默',
        images: ['assets/images/spoonbills/heilianpilu-1.png', 'assets/images/spoonbills/heilianpilu-2.png'],
        audio: 'assets/audio/heilianpilu.m4a'
    },
    // 猛禽
    {
        name: '白腹鹞', latin: 'Circus spilonotus', keywords: 'baifuyao bfy',
        desc: '鹰科中型猛禽,体长50-60厘米。雄鸟头顶至上背白色具宽阔黑褐色纵纹,上体黑褐色具污灰白色斑点,尾上覆羽白色,尾银灰色;下体近白色,喉和胸具黑褐色纵纹。雌鸟暗褐色。',
        call: '叫声:急促尖锐的"叽叽—叽叽—"',
        images: ['assets/images/raptors/baifuyao-1.png', 'assets/images/raptors/baifuyao-2.png', 'assets/images/raptors/baifuyao-3.png'],
        audio: 'assets/audio/baifuyao.m4a'
    },
    {
        name: '黑翅鸢', latin: 'Elanus caeruleus', keywords: 'heichiyuan hcy',
        desc: '鹰科黑翅鸢属小型猛禽,体长约33厘米。整体呈灰白色,额、脸部、下体及翼下覆羽白色,眼先及眼上方有黑色斑,外侧初级飞羽黑色。飞翔时初级飞羽下面黑色和白色下体形成鲜明对照,眼红色,脚黄色。',
        call: '叫声:细尖的"皮—皮皮—皮—"',
        images: ['assets/images/raptors/heichiyuan-1.png', 'assets/images/raptors/heichiyuan-2.png', 'assets/images/raptors/heichiyuan-3.png'],
        audio: 'assets/audio/heichiyuan.m4a'
    },
    {
        name: '红隼', latin: 'Falco tinnunculus', keywords: 'hongsun hs',
        desc: '隼属中小型猛禽,体长31-38厘米,翼展69-74厘米。雄鸟头顶、头侧蓝灰色,背部、肩部和翅膀砖红色;雌鸟上体棕红色,背部至尾上覆羽具粗著黑褐色横斑。可在空中定点振翅悬停,锁定地面鼠类后俯冲捕猎。',
        call: '叫声:尖锐急促的"叽——叽——"',
        images: ['assets/images/raptors/hongsun-1.png', 'assets/images/raptors/hongsun-2.png', 'assets/images/raptors/hongsun-3.png', 'assets/images/raptors/hongsun.jpeg'],
        audio: 'assets/audio/hongsun.m4a'
    },
    // 鸥类
    {
        name: '海鸥', latin: 'Larus canus', keywords: 'haiou ho',
        desc: '鸻形目鸥科鸥属鸟类,体长37-43厘米。喙鲜红色(冬季橙黄色),初级飞羽具黑色斑纹,尾羽纯白,脚橙黄色(繁殖期转褐)。栖息于沿海及内陆水域,以鱼虾、甲壳类及人类食物残渣为食,善游水却不能潜水。',
        call: '叫声:响亮的"嘎—嘎—嘎—"',
        images: ['assets/images/gulls/haiou.png', 'assets/images/gulls/haiou-1.png', 'assets/images/gulls/haiou-3.jpg'],
        audio: 'assets/audio/haiou.m4a'
    },
    // 攀禽
    {
        name: '斑鱼狗', latin: 'Ceryle rudis', keywords: 'banyugou byg',
        desc: '翠鸟科鱼狗属,中等体型,体长27-31厘米,通体呈黑白斑杂状,头顶冠羽较短,尾白色具宽阔的黑色亚端斑,翅上有宽阔的白色翅带。雄鸟有两条黑色胸带,雌鸟仅一条。常在水面上空定点振翅后扎水捕鱼。',
        call: '叫声:尖锐的"叽克—叽克—叽克"',
        images: ['assets/images/kingfishers/banyugou-1.png', 'assets/images/kingfishers/banyugou-2.png', 'assets/images/kingfishers/banyugou-3.png'],
        audio: 'assets/audio/banyugou.m4a'
    },
    // 鹤类
    {
        name: '白头鹤', latin: 'Grus monacha', keywords: 'baitouhe bth',
        desc: '鹤形目鹤科,国家一级保护动物。大中型涉禽,体形较丹顶鹤小,体长90-97厘米,除头部和颈的上部为白色外,其余羽毛均为灰色;眼先至额部黑色,头顶皮肤裸露呈鲜红色,嘴黄绿色,腿和爪黑色。',
        call: '叫声:高亢的"咯—噜—,咯—噜—"',
        images: ['assets/images/others/baitouhe-1.png', 'assets/images/others/baitouhe-2.png', 'assets/images/others/baitouhe-3.png'],
        audio: 'assets/audio/baitouhe.m4a'
    },
    {
        name: '灰鹤', latin: 'Grus grus', keywords: 'huihe hh',
        desc: '鹤形目鹤科,别名千岁鹤、玄鹤。通体羽色几乎全为灰色,前额和眼先黑色,头顶裸区朱红色,喉、前颈和后颈灰黑色,自眼后有一道宽的白色条纹伸至颈背,嘴暗绿色,胫、跗跖及趾灰黑色。',
        call: '叫声:悠远嘹亮的"嘎咯——嘎咯——"',
        images: ['assets/images/others/huihe-1.png', 'assets/images/others/huihe-2.png', 'assets/images/others/huihe-3.png', 'assets/images/others/huihe.png'],
        audio: 'assets/audio/huihe.m4a'
    },
    // 鹳类
    {
        name: '东方白鹳', latin: 'Ciconia boyciana', keywords: 'dongfangbaiguan dfbg',
        desc: '鹳形目鹳科,国家一级保护动物。体态优美,长而粗壮的喙十分坚硬呈黑色,眼睛周围、眼线和喉部裸露皮肤朱红色;身体羽毛纯白色,翅膀宽而长,具有绿色或紫色光泽,腿、脚鲜红色。',
        call: '叫声:成鸟喙部敲击的"哒哒哒"声',
        images: ['assets/images/others/dongfangbaiguan-1.png', 'assets/images/others/dongfangbaiguan-2.png'],
        audio: 'assets/audio/dongfangbaiguan.m4a'
    },
    {
        name: '卷羽鹈鹕', latin: 'Pelecanus crispus', keywords: 'juanyutili jytl',
        desc: '鹈形目鹈鹕科,国家一级保护动物。成鸟体羽灰白色,肩、背、翼上覆羽及尾上覆羽具黑色羽轴,冠羽卷曲而凌乱;初级飞羽黑色,喙铅灰色带黄色喙尖,喙下的喉囊皮黄色,脚铅灰色。',
        call: '叫声:低沉的"吼—吼—"声,幼鸟咩咩叫',
        images: ['assets/images/others/juanyutili-1.png', 'assets/images/others/juanyutili-2.png'],
        audio: 'assets/audio/juanyutili.m4a'
    },
    // 其他
    {
        name: '草鹭', latin: 'Ardea purpurea', keywords: 'caolu cl',
        desc: '鹳形目鹭科。体形呈纺锤形,额和头顶蓝黑色,枕部有两枚黑色辫状羽;上体灰色,两翼飞羽灰黑色,翅角及翼前缘棕栗色,前颈基部有银灰色矛状饰羽,胸和上腹中央棕栗色,虹膜黄色。',
        call: '叫声:粗哑的"呱—呱—"',
        images: ['assets/images/others/caolu-1.png', 'assets/images/others/caolu-2.png'],
        audio: 'assets/audio/caolu.m4a'
    },
    {
        name: '震旦鸦雀', latin: 'Paradoxornis heudei', keywords: 'zhendanyaque zdyq',
        desc: '雀形目鸦雀科,别名苇雀,有"鸟中大熊猫"之称。全长15-18厘米,上背黄褐具黑色纵纹,狭窄白色眼圈,中央尾羽沙褐,其余黑而羽端白,下体近白,两胁黄褐。雌雄羽色相同。',
        call: '叫声:急促连续的"唧唧—唧唧—"声',
        images: ['assets/images/others/zhendanyaque-1.png', 'assets/images/others/zhendanyaque-2.png', 'assets/images/others/zhendanyaque-3.png', 'assets/images/others/zhendanyaque-4.png'],
        audio: 'assets/audio/zhendanyaque.m4a'
    },
    {
        name: '黄鹡鸰', latin: 'Motacilla flava', keywords: 'huangjiling hjl',
        desc: '雀形目鹡鸰科。成鸟额、头顶、头侧、枕和后颈蓝灰色,细长眉纹黄白色;上体灰褐绿色,腰泛黄色;尾窄长黑褐色,外侧两对尾羽几乎全白;下体鲜黄色。体长15-18厘米,体重16-22克。',
        call: '叫声:尖锐的"兹—兹—兹"',
        images: ['assets/images/others/huangjiling-1.png', 'assets/images/others/huangjiling-2.png', 'assets/images/others/huangjiling-3.png'],
        audio: 'assets/audio/huangjiling.m4a'
    },
    {
        name: '栗耳鹀', latin: 'Emberiza fucata', keywords: 'lierwu lew',
        desc: '雀形目鹀科,体重16-27克,体长130-173毫米。繁殖期雄鸟栗色耳羽与灰色顶冠及颈侧成对比,颈部图纹独特,黑色下颊纹下延至胸部与黑色纵纹形成的项纹相接,喉及其余部位白色,胸部有棕色胸带。',
        call: '叫声:尖锐短促的"啧—啧—"声',
        images: ['assets/images/others/lierwu-1.png', 'assets/images/others/lierwu-2.png', 'assets/images/others/lierwu-3.png'],
        audio: 'assets/audio/lierwu.m4a'
    },
    {
        name: '珠颈斑鸠', latin: 'Spilopedia chinensis', keywords: 'zhujingbanjiu zjbj',
        desc: '鸠鸽科副斑鸠属,别名花斑鸠、珍珠鸠。体型中等,体长27-34厘米。颈侧及后颈羽毛基部黑色、顶端白色,形成清晰密集的白色珍珠状羽斑;上体大都褐色或粉褐色,下体粉红色。雌雄羽色相似。',
        call: '叫声:柔和的"咕—咕咕—咕"',
        images: ['assets/images/others/zhujingbanjiu-1.png', 'assets/images/others/zhujingbanjiu-2.png', 'assets/images/others/zhujingbanjiu-3.png'],
        audio: 'assets/audio/zhujingbanjiu.m4a'
    }
];

// ===== 随机轮换逻辑 =====
var heroImg = document.getElementById('heroImg');
var birdName = document.getElementById('birdName');
var birdLatin = document.getElementById('birdLatin');
var birdDesc = document.getElementById('birdDesc');
var birdCall = document.getElementById('birdCall');
var figWrap = document.getElementById('figWrap');
var audioBtn = document.getElementById('birdAudioBtn');
var currentIndex = -1;
var hoverTimer = null;
var currentAudio = null;

// 悬停时暂停自动轮换,移开后恢复
figWrap.addEventListener('mouseenter', function () {
    if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
});

figWrap.addEventListener('mouseleave', function () {
    if (!hoverTimer) {
        hoverTimer = setTimeout(tick, 5000);
    }
});

// 取鸟的展示图:随机选一张
function birdImageSrc(bird) {
    var files = bird.images || [];
    var pick = files[Math.floor(Math.random() * files.length)];
    return pick;
}

// 按名称查鸟
function findBird(name) {
    for (var i = 0; i < BIRDS.length; i++) {
        if (BIRDS[i].name === name) return i;
    }
    return -1;
}

// 随机选一只(不与当前重复)
function randomIndex() {
    var i;
    do {
        i = Math.floor(Math.random() * BIRDS.length);
    } while (i === currentIndex && BIRDS.length > 1);
    return i;
}

// 停止当前播放的叫声
function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
}

function showBird(index) {
    if (index < 0 || index >= BIRDS.length) return;
    currentIndex = index;
    var bird = BIRDS[index];
    stopAudio();

    // 重新计时自动轮换(悬停中则保持暂停)
    if (hoverTimer) {
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
    if (!isAutoPaused()) {
        hoverTimer = setTimeout(tick, 5000);
    }

    // 预加载新图,加载完成后淡入
    var src = birdImageSrc(bird);
    var preloader = new Image();
    preloader.onload = function () {
        heroImg.classList.remove('loaded');
        // 稍等淡出后换图并淡入
        setTimeout(function () {
            heroImg.src = src;
            heroImg.classList.add('loaded');
        }, 300);
    };
    preloader.onerror = function () {
        heroImg.src = src;
        heroImg.classList.add('loaded');
    };
    preloader.src = src;

    // 更新 overlay 文字
    birdName.textContent = bird.name;
    birdLatin.textContent = bird.latin;
    birdDesc.textContent = bird.desc;
    birdCall.textContent = bird.call;

    // 有真实叫声音频的鸟种显示播放按钮
    audioBtn.hidden = !bird.audio;
    // 提前下载音频(浏览器空闲时预加载,点击时几乎秒开)
    if (bird.audio) {
        var preload = new Audio(bird.audio);
        preload.preload = 'auto';
    }
}

function isAutoPaused() {
    return figWrap.matches(':hover');
}

function tick() {
    showBird(randomIndex());
}

// ===== 叫声播放 =====
audioBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    var bird = BIRDS[currentIndex];
    if (!bird || !bird.audio) return;
    stopAudio();
    currentAudio = new Audio(bird.audio);
    currentAudio.play().catch(function () {});
});

// ===== 鸟种搜索:点击放大镜弹出面板,支持鸟名/全拼/首字母缩写 =====
(function () {
    var navSearch = document.getElementById('navSearch');
    var panel = document.getElementById('searchPanel');
    var input = document.getElementById('searchInput');
    var results = document.getElementById('searchResults');
    if (!navSearch || !panel || !input || !results) return;

    function openPanel() {
        navSearch.classList.add('open');
        document.body.classList.add('dropdown-open'); // 搜索时主页同样高斯模糊
        input.focus();
        render('');
    }

    function closePanel() {
        navSearch.classList.remove('open');
        document.body.classList.remove('dropdown-open');
        input.value = '';
        results.innerHTML = '';
    }

    // 匹配:鸟名包含 / 拼音全拼包含 / 首字母缩写包含(不区分大小写)
    function match(q) {
        q = q.trim().toLowerCase();
        if (!q) return BIRDS.slice(0, 5); // 空输入展示前 5 个热门
        return BIRDS.filter(function (b) {
            return b.name.indexOf(q) >= 0 ||
                (b.keywords || '').indexOf(q) >= 0;
        }).slice(0, 8);
    }

    function render(q) {
        var list = match(q);
        if (!list.length) {
            results.innerHTML = '<div class="search-empty">没有找到" ' + q + ' ",试试拼音如 hongsun</div>';
            return;
        }
        results.innerHTML = '';
        list.forEach(function (b) {
            var a = document.createElement('a');
            a.href = 'bird.html?name=' + encodeURIComponent(b.name);
            a.className = 'search-link';
            a.innerHTML = '<img src="' + b.images[0] + '" alt="' + b.name + '"><span>' +
                b.name + '<em>' + b.latin + '</em></span>';
            results.appendChild(a);
        });
    }

    // 点放大镜开面板;再点面板外或按 Esc 关闭
    navSearch.querySelector('a').addEventListener('click', function (e) {
        e.preventDefault();
        if (navSearch.classList.contains('open')) closePanel();
        else openPanel();
    });

    document.addEventListener('click', function (e) {
        if (navSearch.classList.contains('open') && !navSearch.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navSearch.classList.contains('open')) closePanel();
    });

    input.addEventListener('input', function () { render(input.value); });
})();

// ===== 导航交互 =====
// logo 点击回到主页顶部
document.getElementById('homeLink').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // 回主页恢复随机轮换
    showBird(randomIndex());
});

// 其他导航链接占位
document.querySelectorAll('.nav-item > a, .nav-search a').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
    });
});

// ===== 下拉栏打开时主页高斯模糊 =====
document.querySelectorAll('.nav-item.has-drop').forEach(function (item) {
    item.addEventListener('mouseenter', function () {
        document.body.classList.add('dropdown-open');
    });
    item.addEventListener('mouseleave', function () {
        document.body.classList.remove('dropdown-open');
    });
});

// 下拉栏点击鸟种 → 在 hero 展示这只鸟
document.querySelectorAll('.drop-link').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        var idx = findBird(link.dataset.bird);
        if (idx >= 0) {
            showBird(idx);
            // 平滑滚动到鸟图处
            figWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
});

// 点击鸟图:触屏=展开/收起介绍浮层(浮层里可点播放叫声);桌面=手动换一只
var isTouch = window.matchMedia('(hover: none)').matches;
if (isTouch) {
    var hint = document.querySelector('.hero-hint');
    if (hint) hint.textContent = '点按图片查看介绍 · 每 5 秒随机轮换';
}
figWrap.addEventListener('click', function (e) {
    if (isTouch) {
        if (e.target.closest('.bird-audio')) return; // 播放按钮自己处理
        figWrap.classList.toggle('touched');
        // 浮层展开时暂停自动轮换(等同桌面悬停),收起后恢复
        if (figWrap.classList.contains('touched')) {
            if (hoverTimer) {
                clearTimeout(hoverTimer);
                hoverTimer = null;
            }
        } else if (!hoverTimer) {
            hoverTimer = setTimeout(tick, 5000);
        }
        return;
    }
    showBird(randomIndex());
});

// ===== 科普小知识轮播:左右按钮 + JS 驱动卡片悬停动画 =====
(function () {
    var carousel = document.getElementById('tipsCarousel');
    if (!carousel) return;
    var step = 320; // 卡片 300 + 间距 20

    // 平滑滚动:700ms ease-out,比浏览器默认 smooth 更慢更柔
    function smoothScroll(delta) {
        var start = carousel.scrollLeft;
        var target = Math.max(0, Math.min(carousel.scrollWidth - carousel.clientWidth, start + delta));
        var duration = 700;
        var startTime = null;
        function ease(t) { return 1 - Math.pow(1 - t, 3); } // easeOutCubic:起步快、到卡减速
        function frame(now) {
            if (startTime === null) startTime = now;
            var p = Math.min(1, (now - startTime) / duration);
            carousel.scrollLeft = start + (target - start) * ease(p);
            if (p < 1) requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    }

    document.getElementById('tipsPrev').addEventListener('click', function () {
        smoothScroll(-step);
    });
    document.getElementById('tipsNext').addEventListener('click', function () {
        smoothScroll(step);
    });

    // 每张卡片 mouseenter/mouseleave 切换 .active 类,驱动 emoji/标题动画
    // (与 CSS :hover 双通道,确保效果必触发)
    document.querySelectorAll('.tip-card').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            card.classList.add('active');
        });
        card.addEventListener('mouseleave', function () {
            card.classList.remove('active');
        });

        // 点击/回车跳转到对应科普详情页
        function go() {
            var slug = card.getAttribute('data-tip');
            if (slug) window.location.href = 'tips/' + slug + '.html';
        }
        card.addEventListener('click', go);
        card.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
        });
    });
})();

// ===== 翎鸣百态:3D 鸟类卡片墙 =====
// 动态生成全部鸟种卡片:正面鸟图+鸟名,悬停翻面见学名/分类/简介;点击跳详情页
(function () {
    var grid = document.getElementById('wallGrid');
    if (!grid) return;

    // 鸟种分类映射(与顶部导航的分类口径一致)
    var CATEGORY = {
        '反嘴鹬': '鸻鹬类', '凤头麦鸡': '鸻鹬类',
        '斑头秋沙鸭': '雁鸭类', '罗纹鸭': '雁鸭类', '琵嘴鸭': '雁鸭类',
        '小天鹅': '雁鸭类', '中华秋沙鸭': '雁鸭类', '花脸鸭': '雁鸭类', '斑嘴鸭': '雁鸭类',
        '白琵鹭': '琵鹭', '黑脸琵鹭': '琵鹭',
        '白腹鹞': '猛禽', '黑翅鸢': '猛禽', '红隼': '猛禽',
        '海鸥': '鸥类', '斑鱼狗': '攀禽',
        '白头鹤': '鹤类', '灰鹤': '鹤类',
        '东方白鹳': '鹳类', '卷羽鹈鹕': '鹳类',
        '草鹭': '其他', '震旦鸦雀': '其他', '黄鹡鸰': '其他', '栗耳鹀': '其他', '珠颈斑鸠': '其他'
    };

    BIRDS.forEach(function (bird) {
        var card = document.createElement('a');
        card.className = 'wall-card';
        card.href = 'bird.html?name=' + encodeURIComponent(bird.name);
        // 简介取前 60 字
        var brief = bird.desc.length > 60 ? bird.desc.slice(0, 60) + '…' : bird.desc;
        card.innerHTML =
            '<div class="wall-face wall-front">' +
                '<img src="' + bird.images[0] + '" alt="' + bird.name + '" loading="lazy">' +
                '<span class="wall-name">' + bird.name + '</span>' +
            '</div>' +
            '<div class="wall-face wall-back">' +
                '<em class="wall-latin">' + bird.latin + '</em>' +
                '<span class="wall-badge">' + (CATEGORY[bird.name] || '其他') + '</span>' +
                '<p class="wall-desc">' + brief + '</p>' +
                '<span class="wall-more">查看详情 ›</span>' +
            '</div>';
        grid.appendChild(card);
    });

    // 墙体 3D 倾斜效果已按需求取消(卡片墙保留静态网格 + 悬停翻面)
})();

// ===== Hero 视差滚动 =====
// 三层装饰以不同系数平移:远景芦苇 0.15x / 中景水鸟 0.35x / 近景蒲草 0.6x,
// 滚动时近快远慢;scroll 监听 + rAF 节流,每帧最多更新一次
(function () {
    var layers = [
        { el: document.querySelector('.hero-deco--far'), speed: 0.15 },
        { el: document.querySelector('.hero-deco--mid'), speed: 0.35 },
        { el: document.querySelector('.hero-deco--near'), speed: 0.6 }
    ].filter(function (l) { return !!l.el; });
    if (!layers.length) return;

    var ticking = false;

    function update() {
        ticking = false;
        var y = window.scrollY;
        layers.forEach(function (l) {
            l.el.style.transform = 'translateY(' + (-y * l.speed).toFixed(1) + 'px)';
        });
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }, { passive: true });

    update(); // 初始位置(刷新后停留在页面中部时也正确)
})();

// ===== 鼠标羽毛拖尾 =====
// 桌面端鼠标移动时留下淡淡的羽毛剪影,小羽毛边飘边淡出(~1s);
// 单个复用 DOM 节点池,节流 + 距离阈值,开销极小;触屏/减弱动态效果时禁用
(function () {
    if (window.matchMedia('(hover: none)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var POOL = 14;          // 羽毛池大小
    var GAP = 180;          // 每移动多少 px 掉一根羽毛(间距再拉大,进一步降低密度)
    var lastX = -999, lastY = -999;
    var pool = [];
    var frag = document.createDocumentFragment();

    for (var i = 0; i < POOL; i++) {
        var f = document.createElement('div');
        f.className = 'feather-trail';
        f.setAttribute('aria-hidden', 'true');
        f.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor">' +
            '<path d="M20.5 3.5c-3.2-1.5-7.4-.6-10.3 2.3C7.3 8.7 6.4 12.9 7.9 16c-1.9 1-3.5 2.4-4.6 4.1.3.2.6.4.9.6 1-1.6 2.5-3 4.3-3.8.3.5.6.9 1 1.3 2.9 2.9 7.1 3.8 10.3 2.3L21 18.8 18.7 6.3 20.5 3.5z"/>' +
        '</svg>';
        frag.appendChild(f);
        pool.push({ el: f, free: true });
    }
    document.body.appendChild(frag);

    // 取一根空闲羽毛(或最旧的那根)
    function take() {
        for (var j = 0; j < POOL; j++) {
            if (pool[j].free) return pool[j];
        }
        return pool[0];
    }

    document.addEventListener('mousemove', function (e) {
        var dx = e.clientX - lastX, dy = e.clientY - lastY;
        if (dx * dx + dy * dy < GAP * GAP) return; // 距离不足,不掉毛
        lastX = e.clientX;
        lastY = e.clientY;

        var p = take();
        p.free = false;
        var el = p.el;
        // 落点带一点随机偏移,旋转随机,像羽毛自然飘落
        var rot = Math.atan2(dy, dx) * 180 / Math.PI;
        el.style.left = e.clientX + 'px';
        el.style.top = e.clientY + 'px';
        el.style.setProperty('--fr', (rot + (Math.random() * 60 - 30)).toFixed(0) + 'deg');
        el.style.setProperty('--fdx', (Math.random() * 36 - 18).toFixed(0) + 'px');
        el.style.setProperty('--fdy', (14 + Math.random() * 26).toFixed(0) + 'px');
        el.style.setProperty('--fs', (0.5 + Math.random() * 0.5).toFixed(2));
        el.classList.remove('fly');
        // 强制重排,重启动画
        void el.offsetWidth;
        el.classList.add('fly');

        // 动画结束后归还节点池
        clearTimeout(p.timer);
        p.timer = setTimeout(function () {
            p.free = true;
            el.classList.remove('fly');
        }, 1100);
    }, { passive: true });
})();

// 初始展示反嘴鹬(与原设计一致),之后每 5 秒随机轮换(悬停时暂停)
showBird(0);
