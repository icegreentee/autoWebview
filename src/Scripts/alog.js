export default function algo_init() {
    function getWindowSize() {
        var wm = context.getSystemService(context.WINDOW_SERVICE);
        var pt = new Point();
        wm.getDefaultDisplay().getSize(pt);
        return pt;
    }
    // for debug
    const AUTO_LIMIT = 4;
    // click with root permission
    function clickRoot(x, y) {
        var result = shell("su\ninput tap " + x + " " + y + "\nexit\n");
        // detect reason when click did not succeed
        if (result.code != 0) {
            result = shell("which su");
            if (result.code == 0) {
                // device already rooted, but permission not granted
                toastLog("root权限获取失败");
            } else {
                // device not rooted
                toastLog("Android 7 以下设备运行脚本需要root");
            }
            // terminate when click cannot be successfully performed
            threads.currentThread().interrupt();
        }
    }

    function click(x, y) {
        // limit range
        var sz = getWindowSize();
        if (x >= sz.x) {
            x = sz.x - 1;
        }
        if (y >= sz.y) {
            y = sz.y - 1;
        }
        // system version higher than Android 7.0
        if (device.sdkInt >= 24) {
            // now accessibility gesture APIs are available
            press(x, y, 50);
        } else {
            clickRoot(x, y);
        }
    }

    // find first element using regex
    function match(reg, wait) {
        var startTime = new Date().getTime();
        var result = null;
        let it = 0;
        do {
            it++;
            auto.root.refresh();
            result = textMatches(reg).findOnce();
            if (result && result.refresh()) break;
            result = descMatches(reg).findOnce();
            if (result && result.refresh()) break;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        return result;
    }

    // find all element using regex
    function matchAll(reg, wait) {
        var startTime = new Date().getTime();
        var result = [];
        let it = 0;
        do {
            it++;
            result = textMatches(reg).find();
            result = result.filter((x) => x.refresh());
            if (result.length >= 1) break;
            result = descMatches(reg).find();
            result = result.filter((x) => x.refresh());
            if (result.length >= 1) break;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        return result;
    }

    // find first element using plain text
    function find(txt, wait) {
        var startTime = new Date().getTime();
        var result = null;
        let it = 0;
        do {
            it++;
            auto.root.refresh();
            result = text(txt).findOnce();
            if (result && result.refresh()) break;
            result = desc(txt).findOnce();
            if (result && result.refresh()) break;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        return result;
    }

    // find all element using plain text
    function findAll(txt, wait) {
        var startTime = new Date().getTime();
        var result = [];
        var it = 0;
        do {
            it++;
            auto.root.refresh();
            result = text(txt).find();
            result = result.filter((x) => x.refresh());
            if (result.length >= 1) break;
            result = desc(txt).find();
            result = result.filter((x) => x.refresh());
            if (result.length >= 1) break;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        return result;
    }

    function findID(name, wait) {
        var startTime = new Date().getTime();
        var result = null;
        var it = 0;
        do {
            it++;
            auto.root.refresh();
            result = id(name).findOnce();
            if (result && result.refresh()) break;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        return result;
    }

    function waitElement(element, wait) {
        var startTime = new Date().getTime();
        var result;
        do {
            if (!element.refresh()) return;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
    }

    function waitAny(fnlist, wait) {
        var startTime = new Date().getTime();
        var result = null;
        var it = 0;
        var current = 0;
        do {
            it++;
            if (current >= fnlist.length) current = 0;
            result = fnlist[current]();
            if (result && result.refresh()) break;
            current++;
            sleep(100);
        } while (wait === true || (wait && new Date().getTime() < startTime + wait));
        if (wait)
            log(
                "find " +
                fnlist.length +
                " items for " +
                (new Date().getTime() - startTime) +
                " with " +
                it +
                " limit " +
                wait
            );
    }

    function getContent(element) {
        if (element) {
            return element.text() === "" ? element.desc() : element.text();
        }
    }

    function checkNumber(content) {
        return !isNaN(Number(content)) && !isNaN(parseInt(content));
    }

    function getAP() {
        if (findID("baseContainer")) {
            // values and seperator are together
            while (true) {
                let result = null;
                let h = getWindowSize().y;
                let elements = matchAll(/^\d+\/\d+$/, true);
                for (let element of elements) {
                    if (element.bounds().top < h) {
                        if (
                            element.indexInParent() == element.parent().childCount() - 1 ||
                            !(
                                "" + getContent(element.parent().child(element.indexInParent() + 1))
                            ).startsWith("Rank")
                        ) {
                            let content = getContent(element);
                            h = element.bounds().top;
                            result = {
                                value: parseInt(content.split("/")[0]),
                                total: parseInt(content.split("/")[1]),
                                bounds: element.bounds(),
                            };
                        }
                    }
                }
                if (result) return result;
                sleep(500);
            }
        } else {
            // ... are seperate
            while (true) {
                let result = null;
                let h = getWindowSize().y;
                let elements = findAll("/", true);
                for (let element of elements) {
                    if (element.bounds().top < h) {
                        if (
                            element.indexInParent() > 1 &&
                            element.indexInParent() < element.parent().childCount() - 1
                        ) {
                            var previous = element.parent().child(element.indexInParent() - 1);
                            var next = element.parent().child(element.indexInParent() + 1);
                            if (
                                checkNumber(getContent(previous)) &&
                                checkNumber(getContent(next))
                            ) {
                                h = element.bounds().top;
                                result = {
                                    value: Number(getContent(previous)),
                                    total: Number(getContent(next)),
                                    bounds: element.bounds(),
                                };
                            }
                        }
                    }
                }
                if (result) return result;
                sleep(500);
            }
        }
    }

    function getPTList() {
        let elements = matchAll(/^\+\d*$/);
        let results = [];
        let left = 0;
        log("PT匹配结果数量" + elements.length);
        for (var element of elements) {
            var content = getContent(element);
            // pt value and "+" are seperate
            if (content == "+") {
                if (element.indexInParent() < element.parent().childCount() - 1) {
                    var next = element.parent().child(element.indexInParent() + 1);
                    if (checkNumber(getContent(next))) {
                        results.push({
                            value: Number(getContent(next)),
                            bounds: element.bounds(),
                        });
                        if (element.bounds().left > left) left = element.bounds().left;
                    }
                }
            }
            // ... are together
            else {
                if (checkNumber(content.slice(1))) {
                    results.push({
                        value: Number(content.slice(1)),
                        bounds: element.bounds(),
                    });
                    if (element.bounds().left > left) left = element.bounds().left;
                }
            }
        }

        return results.filter((result) => result.bounds.left == left);
    }

    function getCostAP() {
        let elements = findAll(string.cost_ap);
        for (let element of elements) {
            if (element.indexInParent() < element.parent().childCount() - 1) {
                var next = element.parent().child(element.indexInParent() + 1);
                if (checkNumber(getContent(next))) {
                    return Number(getContent(next));
                }
            }
        }
    }

    const STATE_LOGIN = 0;
    const STATE_HOME = 1;
    const STATE_MENU = 2;
    const STATE_SUPPORT = 3;
    const STATE_TEAM = 4;
    const STATE_BATTLE = 5;
    const STATE_REWARD_CHARACTER = 6;
    const STATE_REWARD_MATERIAL = 7;
    const STATE_REWARD_POST = 8;

    // strings constants
    const strings = {
        name: [
            "support",
            "revive_title",
            "revive_button",
            "revive_popup",
            "revive_confirm",
            "out_of_ap",
            "start",
            "follow",
            "follow_append",
            "battle_confirm",
            "cost_ap",
            "regex_drug",
            "regex_lastlogin",
            "regex_bonus",
            "regex_autobattle",
        ],
        zh_Hans: [
            "请选择支援角色",
            "AP回复",
            "回复",
            "回复确认",
            "回复",
            "AP不足",
            "开始",
            "关注",
            "关注追加",
            "确定",
            "消耗AP",
            /^\d+个$/,
            /^最终登录.+/,
            /＋\d+个$/,
            /[\s\S]*续战/,
        ],
        zh_Hant: [
            "請選擇支援角色",
            "AP回復",
            "回復",
            "回復確認",
            "進行回復",
            "AP不足",
            "開始",
            "關注",
            "追加關注",
            "決定",
            "消費AP",
            /^\d+個$/,
            /^最終登入.+/,
            /＋\d+個$/,
            /[\s\S]*周回/,
        ],
        ja: [
            "サポートキャラを選んでください",
            "AP回復",
            "回復",
            "回復確認",
            "回復する",
            "AP不足",
            "開始",
            "フォロー",
            "フォロー追加",
            "決定",
            "消費AP",
            /^\d+個$/,
            /^最終ログイン.+/,
            /＋\d+個$/,
            /[\s\S]*周回/,
        ],
    };

    var string = {};
    var druglimit = [NaN, NaN, NaN];
    var usedrug = false;
    var currentname = "";

    function initialize() {
        var element = auto.root;
        if (element) {
            currentname = element.packageName();
            var current = [];
            if (currentname == "com.bilibili.madoka.bilibili") {
                log("检测为国服");
                current = strings.zh_Hans;
            } else if (currentname == "com.komoe.madokagp") {
                log("检测为台服");
                current = strings.zh_Hant;
            } else if (currentname == "com.aniplex.magireco") {
                log("检测为日服");
                current = strings.ja;
            }
            for (let i = 0; i < strings.name.length; i++) {
                string[strings.name[i]] = current[i];
            }
            usedrug = false;
            for (let i = 0; i < 3; i++) {
                druglimit[i] = limit["drug" + (i + 1)]
                    ? parseInt(limit["drug" + (i + 1) + "num"])
                    : 0;
                if (druglimit[i] !== 0) {
                    usedrug = true;
                }
            }
        } else {
            toastLog("未在前台检测到魔法纪录");
            threads.currentThread().interrupt();
        }
    }

    // isolate logic for future adaption
    function ifUseDrug(index, count) {
        // when drug is valid
        if ((index < 2 && count > 0) || count > 4) {
            // unlimited
            if (isNaN(druglimit[index])) return true;
            else if (druglimit[index] > 0) return true;
        }
    }

    function updateDrugLimit(index) {
        if (!isNaN(druglimit[index])) {
            druglimit[index]--;
            limit["drug" + (index + 1) + "num"] = "" + druglimit[index];
        }
    }

    function refillAP() {
        log("尝试使用回复药");
        do {
            var usedrug = false;
            var numbers = matchAll(string.regex_drug, true);
            var buttons = findAll(string.revive_button);
            // when things seems to be correct
            if (numbers.length == 3 && buttons.length == 3) {
                for (let i = 0; i < 3; i++) {
                    if (ifUseDrug(i, parseInt(getContent(numbers[i]).slice(0, -1)))) {
                        log("使用第" + (i + 1) + "种回复药, 剩余" + druglimit[i] + "次");
                        var bound = buttons[i].bounds();
                        do {
                            click(bound.centerX(), bound.centerY());
                            // wait for confirmation popup
                        } while (!find(string.revive_popup, 2000));
                        log("点击确认回复");
                        bound = find(string.revive_confirm, true).bounds();
                        click(bound.centerX(), bound.centerY());
                        usedrug = true;
                        updateDrugLimit(i);
                        break;
                    }
                }
            }
            if (!usedrug && find(string.out_of_ap)) {
                log("AP不足且未嗑药，退出");
                threads.currentThread().interrupt();
            }
            // wait for refill window to be back
            var element = find(string.revive_title, true);
            var apinfo = getAP();
            log("当前AP:" + apinfo.value + "/" + apinfo.total);
        } while (usedrug && limit.useAuto && apinfo.value <= apinfo.total * AUTO_LIMIT);
        // now close the window
        while (element.refresh()) {
            log("关闭回复窗口");
            bound = element.parent().bounds();
            click(bound.right, bound.top);
            waitElement(element, 5000);
        }
        return usedrug;
    }

    function selectBattle() { }

    function taskDefault() {
        initialize();
        var state = STATE_MENU;
        var battlename = "";
        var charabound = null;
        var tryusedrug = true;
        var battlepos = null;
        var inautobattle = false;
        while (true) {
            switch (state) {
                case STATE_MENU: {
                    waitAny(
                        [
                            () => find(string.support),
                            () => findID("helpBtn"),
                            () => match(/^BATTLE.+/),
                        ],
                        3000
                    );
                    // exit condition
                    if (find(string.support)) {
                        state = STATE_SUPPORT;
                        log("进入助战选择");
                        break;
                    }
                    // if AP is not enough
                    if (findID("popupInfoDetailTitle")) {
                        // try use drug
                        tryusedrug = refillAP();
                    }
                    // if need to click to enter battle
                    let button = find(string.battle_confirm);
                    if (button) {
                        log("点击确认进入battle");
                        let bound = button.bounds();
                        click(bound.centerX(), bound.centerY());
                        // wait for support screen for 5 seconds
                        find(string.support, 5000);
                    } else if (battlepos) {
                        log("尝试点击关卡坐标");
                        click(battlepos.x, battlepos.y);
                        waitAny(
                            [() => find(string.battle_confirm), () => find(string.support)],
                            5000
                        );
                    }
                    // click battle if available
                    else if (battlename) {
                        let battle = find(battlename);
                        if (battle) {
                            log("尝试点击关卡名称");
                            let bound = battle.bounds();
                            click(bound.centerX(), bound.centerY());
                            waitAny(
                                [() => find(string.battle_confirm), () => find(string.support)],
                                5000
                            );
                        }
                    } else {
                        log("等待捕获关卡坐标");
                        battlepos = capture();
                    }
                    break;
                }

                case STATE_SUPPORT: {
                    // exit condition
                    if (findID("nextPageBtn")) {
                        state = STATE_TEAM;
                        log("进入队伍调整");
                        break;
                    }
                    // if we need to refill AP
                    let apinfo = getAP();
                    let apcost = getCostAP();
                    log(
                        "消费AP",
                        apcost,
                        "用药",
                        usedrug,
                        "当前AP",
                        apinfo.value,
                        "AP上限",
                        apinfo.total
                    );
                    if (
                        ((limit.useAuto && apinfo.value <= apinfo.total * AUTO_LIMIT) ||
                            (apcost && apinfo.value < apcost * 2)) &&
                        usedrug &&
                        tryusedrug
                    ) {
                        // open revive window
                        let revive_window;
                        do {
                            click(apinfo.bounds.centerX(), apinfo.bounds.centerY());
                            revive_window = findID("popupInfoDetailTitle", 5000);
                        } while (!revive_window);
                        // try use drug
                        tryusedrug = refillAP();
                    }
                    // save battle name if needed
                    let battle = match(/^BATTLE.+/);
                    if (battle) {
                        battlename = getContent(battle);
                    }
                    // pick support
                    let ptlist = getPTList();
                    let playercount = matchAll(string.regex_lastlogin).length;
                    log("候选数量" + ptlist.length + ",玩家数量" + playercount);
                    if (ptlist.length) {
                        let bound;
                        if (
                            ptlist.length > playercount &&
                            (limit.justNPC || ptlist[ptlist.length - 1].value > ptlist[0].value)
                        ) {
                            log("选择NPC助战");
                            // NPC comes in the end of list if available
                            bound = ptlist[ptlist.length - 1].bounds;
                        } else {
                            log("选择玩家助战");
                            // higher PT bonus goes ahead
                            bound = ptlist[0].bounds;
                        }
                        click(bound.centerX(), bound.centerY());
                        // wait for start button for 5 seconds
                        findID("nextPageBtn", 5000);
                        break;
                    }
                    // if unexpectedly treated as long touch
                    if (findID("detailTab")) {
                        log("误点击，尝试返回");
                        let element = className("EditText").findOnce();
                        if (element && element.refresh()) {
                            let bound = element.bounds();
                            click(bound.left, bound.top);
                        }
                        find(string.support, 5000);
                    }
                    break;
                }

                case STATE_TEAM: {
                    var element = limit.useAuto ? findID("nextPageBtnLoop") : findID("nextPageBtn");
                    if (limit.useAuto) {
                        if (element) {
                            inautobattle = true;
                        } else {
                            element = findID("nextPageBtn");
                            if (element) {
                                inautobattle = false;
                                log("未发现自动续战，改用标准战斗");
                            }
                        }
                    }
                    // exit condition
                    if (findID("android:id/content") && !element) {
                        state = STATE_BATTLE;
                        log("进入战斗");
                        break;
                    }
                    // click start
                    if (element) {
                        let bound = element.bounds();
                        click(bound.centerX(), bound.centerY());
                        waitElement(element, 500);
                    }
                    break;
                }

                case STATE_BATTLE: {
                    // exit condition
                    if (findID("charaWrap")) {
                        state = STATE_REWARD_CHARACTER;
                        log("进入角色结算");
                        break;
                    }
                    break;
                }

                case STATE_REWARD_CHARACTER: {
                    // exit condition
                    if (findID("hasTotalRiche")) {
                        state = STATE_REWARD_MATERIAL;
                        log("进入掉落结算");
                        break;
                    }
                    let element = findID("charaWrap");
                    if (element) {
                        if (element.bounds().height() > 0) charabound = element.bounds();
                        let targetX = element.bounds().right;
                        let targetY = element.bounds().bottom;
                        // click if upgrade
                        element = find("OK");
                        if (element) {
                            log("点击玩家升级确认");
                            let bound = element.bounds();
                            targetX = bound.centerX();
                            targetY = bound.centerY();
                        }
                        click(targetX, targetY);
                    }
                    sleep(500);
                    break;
                }

                case STATE_REWARD_MATERIAL: {
                    // exit condition
                    let element = findID("hasTotalRiche");
                    if (findID("android:id/content") && !element) {
                        state = STATE_REWARD_POST;
                        log("结算完成");
                        break;
                    }
                    // try click rebattle
                    element = findID("questRetryBtn");
                    if (element) {
                        log("点击再战按钮");
                        let bound = element.bounds();
                        click(bound.centerX(), bound.centerY());
                    } else if (charabound) {
                        log("点击再战区域");
                        click(charabound.right, charabound.bottom);
                    }
                    sleep(500);
                    break;
                }

                case STATE_REWARD_POST: {
                    // wait 5 seconds for transition
                    match(/\d*\/\d*/, 5000);
                    // exit condition
                    if (findID("nextPageBtn")) {
                        state = STATE_SUPPORT;
                        log("进入助战选择");
                        break;
                    } else if (match(/\d*\/\d*/)) {
                        state = STATE_MENU;
                        log("进入关卡选择");
                        break;
                    } else if (inautobattle) {
                        state = STATE_BATTLE;
                        break;
                    }
                    // try to skip
                    let element = className("EditText").findOnce();
                    if (element && element.refresh()) {
                        log("尝试跳过剧情");
                        let bound = element.bounds();
                        click(bound.right, bound.top);
                    }
                    break;
                }
            }
        }
    }

    return {
        default: taskDefault,
    };
}